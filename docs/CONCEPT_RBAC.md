# Role-Based Access Control (RBAC) Explained

This document explains how we manage different user types (Admin, Lecturer, Student) and ensure they only see what they are supposed to see.

## **The Concept**

RBAC means giving permissions based on a user's "Role".

* **Admin**: Can Create, Read, Update, Delete (CRUD) everything.
* **Lecturer**: Can Read (View) only their own data.
* **Student**: Can Read (View) only their own data.

## **Backend Implementation (Django)**

### **1. The User Model (`users/models.py`)**

We extended the default Django User to add a `role` field.

```python
class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('lecturer', 'Lecturer'),
        ('student', 'Student'),
    )
    role = models.CharField(choices=ROLE_CHOICES, max_length=10)
```

### **2. Permissions (`users/permissions.py` - *Implicit*)**

In our Views, we check this role. For example, in `TimetableViewSet`:

```python
def get_queryset(self):
    user = self.request.user
    
    # Admin sees EVERYTHING
    if user.role == 'admin':
        return TimetableSlot.objects.all()
        
    # Lecturer sees ONLY their subjects
    elif user.role == 'lecturer':
        return TimetableSlot.objects.filter(subject__lecturer=user)
        
    # Student sees ONLY their course's subjects
    elif user.role == 'student':
        return TimetableSlot.objects.filter(
            subject__course=user.studentprofile.course
        )
```

*This is the core security layer. Even if a student tries to "hack" the API to see another course, the server returns an empty list.*

---

## **Frontend Implementation (React)**

### **1. Protected Route Component (`components/ProtectedRoute.jsx`)**

This is a "Gatekeeper" component. It wraps around pages we want to protect.

```javascript
<Route element={<ProtectedRoute allowedRoles={['admin']} />}>
    <Route path="/admin" element={<AdminDashboard />} />
</Route>
```

**How it works:**

1. Check `user.role` from AuthContext.
2. Is `user.role` in `['admin']`?
    * **Yes**: Render the Page (`<Outlet />`).
    * **No**: Redirect to `/unauthorized` or `/login`.

### **2. Dynamic UI (`components/Layout.jsx`)**

The navigation bar changes based on the role.

```javascript
{user.role === 'admin' && (
    <Link to="/admin/manage-courses">Manage Courses</Link>
)}
{user.role === 'student' && (
    <Link to="/student/timetable">My Timetable</Link>
)}
```

*This ensures students don't even see the buttons for Admin pages.*
