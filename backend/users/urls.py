from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, 
    LecturerProfileViewSet, 
    StudentProfileViewSet, 
    LogoutView,
    get_current_user
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'lecturers', LecturerProfileViewSet)
router.register(r'students', StudentProfileViewSet)
router.register(r'auth/logout', LogoutView, basename='auth_logout')

urlpatterns = [
    # Get current authenticated user (validates JWT)
    path('auth/me/', get_current_user, name='current_user'),
    path('', include(router.urls)),
]
