# JWT Authentication Guide

## Backend Setup (Django)

### 1. Install Package

```bash
pip install djangorestframework-simplejwt
```

### 2. Configure Settings

```python
# settings.py
INSTALLED_APPS = [
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}
```

### 3. Add URLs

```python
# urls.py
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('api/auth/login/', TokenObtainPairView.as_view()),
    path('api/auth/refresh/', TokenRefreshView.as_view()),
]
```

---

## Frontend Setup (React)

### 1. Create API Service

```javascript
// services/api.js
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8000/api/' });

// Attach token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            const refresh = localStorage.getItem('refresh_token');
            const res = await axios.post('http://localhost:8000/api/auth/refresh/', { refresh });
            localStorage.setItem('access_token', res.data.access);
            return api(error.config);
        }
        return Promise.reject(error);
    }
);

export default api;
```

### 2. Login Function

```javascript
const login = async (email, password) => {
    const res = await api.post('auth/login/', { email, password });
    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);
};
```

---

## Security Notes

- ✅ Backend validates all tokens
- ✅ Frontend never decodes JWT for security decisions
- ✅ Use `/auth/me` endpoint to get user data
- ✅ Tokens auto-refresh on expiration
- ✅ Logout blacklists refresh tokens
