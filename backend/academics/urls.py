from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, SubjectViewSet, ClassroomViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'subjects', SubjectViewSet)
router.register(r'classrooms', ClassroomViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
