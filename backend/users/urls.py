from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, LecturerProfileViewSet, StudentProfileViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'lecturers', LecturerProfileViewSet)
router.register(r'students', StudentProfileViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
