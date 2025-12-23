# JWT Authentication Guide (Django + React)

This guide explains how to implement JWT (JSON Web Token) authentication from scratch, just like we did in this project.

---

## **Part 1: Backend (Django)**

### **Step 1: Install the Library**

We use `djangorestframework-simplejwt`, the standard library for JWT in Django.

```bash
pip install djangorestframework-simplejwt
```

### **Step 2: Configure `settings.py`**

Tell Django to use JWT as the default authentication method.

```python
# settings.py

INSTALLED_APPS = [
    ...
    'rest_framework',
    'rest_framework_simplejwt',  # Add this
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),  # Token expires in 1 hour
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),     # Refresh lasts 1 day
}
```

### **Step 3: Add Login URLs**

SimpleJWT provides ready-made views to get tokens. You just need to add them to `urls.py`.

```python
# urls.py
from rest_framework_simplejwt.views import (
    TokenObtainPairView,  # For Login (Get Access + Refresh Token)
    TokenRefreshView,     # For Refreshing Access Token
)

urlpatterns = [
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
```

---

## **Part 2: Frontend (React)**

### **Step 1: Install `jwt-decode`**

We need this to read the token (to know the user ID or expiration time).

```bash
npm install jwt-decode
```

### **Step 2: Create an Axios Interceptor (`api.js`)**

This is the **most important part**. It automates the token handling so you don't have to manually add headers to every request.

**Logic:**

1. **Request Interceptor**: Before sending any request, check if we have a token. If yes, add `Authorization: Bearer <token>`.
2. **Response Interceptor**: If the backend says "401 Unauthorized" (Token Expired), try to use the **Refresh Token** to get a new Access Token automatically.

```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8000/api/' });

// 1. Attach Token to Requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 2. Handle Expired Tokens (Auto-Refresh)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response.status === 401) {
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const res = await axios.post('http://localhost:8000/api/auth/refresh/', {
                    refresh: refreshToken
                });
                localStorage.setItem('access_token', res.data.access);
                // Retry the original failed request
                return api(error.config);
            } catch (err) {
                // Refresh failed? Logout user.
                localStorage.clear();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
```

### **Step 3: Create Auth Context (`AuthContext.jsx`)**

This manages the global "User State" (Is logged in? Who is it?).

```javascript
// src/context/AuthContext.jsx
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (email, password) => {
        // 1. Call Backend Login
        const res = await api.post('auth/login/', { email, password });
        
        // 2. Save Tokens
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        
        // 3. Decode Token to get User Info
        const decoded = jwtDecode(res.data.access);
        setUser({ id: decoded.user_id });
    };

    return (
        <AuthContext.Provider value={{ user, login }}>
            {children}
        </AuthContext.Provider>
    );
};
```

---

## **Summary of Flow**

1. **User logs in** -> React sends email/password to Django.
2. **Django** checks DB -> Returns `access_token` (short life) and `refresh_token` (long life).
3. **React** saves tokens in `localStorage`.
4. **React** sends `access_token` in the Header for every API call (`api.js`).
5. **Token Expires?** -> `api.js` automatically uses `refresh_token` to get a new one without the user noticing.
