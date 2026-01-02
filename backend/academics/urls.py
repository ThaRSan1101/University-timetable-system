from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, SubjectViewSet, ClassroomViewSet, SystemSettingsViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'subjects', SubjectViewSet)
router.register(r'classrooms', ClassroomViewSet)
router.register(r'settings', SystemSettingsViewSet, basename='settings')

urlpatterns = [
    path('', include(router.urls)),
]
