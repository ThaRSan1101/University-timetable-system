from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Course, Subject, Classroom, SystemSettings
from .serializers import CourseSerializer, SubjectSerializer, ClassroomSerializer
from collections import defaultdict


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    
    def get_permissions(self):
        """
        Allow unauthenticated users to list courses (for registration)
        All other actions require authentication
        """
        if self.action == 'list':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    
    def get_queryset(self):
        """
        SECURITY: Filter courses based on user role
        """
        user = self.request.user
        queryset = Course.objects.all()
        
        # Students see only their course (if authenticated)
        if user.is_authenticated and user.role == 'student' and hasattr(user, 'student_profile'):
            if user.student_profile.course:
                queryset = queryset.filter(id=user.student_profile.course.id)
        
        return queryset


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        SECURITY: Filter subjects based on user role
        """
        user = self.request.user
        queryset = Subject.objects.select_related('course', 'lecturer').all()
        
        # Students see only their course subjects
        if user.role == 'student' and hasattr(user, 'student_profile'):
            if user.student_profile.course:
                queryset = queryset.filter(course=user.student_profile.course)
        
        # Lecturers see only their subjects
        elif user.role == 'lecturer':
            queryset = queryset.filter(lecturer=user)
        
        return queryset
    
    @action(detail=False, methods=['get'], url_path='grouped')
    def get_grouped_subjects(self, request):
        """
        BACKEND LOGIC: Group subjects by semester
        
        Returns subjects organized by semester with all necessary metadata
        Eliminates frontend grouping/sorting logic
        
        Query params:
        - course_id: Filter by course (optional)
        - year: Filter by year (optional)
        """
        queryset = self.get_queryset()
        
        # Apply filters
        course_id = request.query_params.get('course_id')
        year = request.query_params.get('year')
        
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        if year:
            queryset = queryset.filter(year=year)
        
        # Group by semester
        grouped = defaultdict(list)
        
        for subject in queryset:
            semester_key = f"Semester {subject.semester}"
            grouped[semester_key].append({
                'id': subject.id,
                'name': subject.name,
                'code': subject.code,
                'course': {
                    'id': subject.course.id if subject.course else None,
                    'name': subject.course.name if subject.course else None,
                },
                'lecturer': {
                    'id': subject.lecturer.id if subject.lecturer else None,
                    'name': subject.lecturer.username if subject.lecturer else 'TBA',
                },
                'year': subject.year,
                'semester': subject.semester,
                'weekly_hours': subject.weekly_hours,
                'priority': subject.priority,
                'display': {
                    'semester_label': semester_key,
                    'credits': subject.weekly_hours,  # Assuming weekly_hours = credits
                }
            })
        
        # Sort semesters and subjects within each semester
        sorted_semesters = sorted(grouped.keys())
        result = {}
        
        for semester in sorted_semesters:
            # Sort subjects by code within semester
            result[semester] = sorted(grouped[semester], key=lambda x: x['code'])
        
        return Response({
            'grouped_modules': result,
            'semesters': sorted_semesters,
            'total_subjects': sum(len(subjects) for subjects in result.values())
        })


class ClassroomViewSet(viewsets.ModelViewSet):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        SECURITY: All authenticated users can view classrooms
        Only admins can modify
        """
        return Classroom.objects.all()
    
    def get_permissions(self):
        """
        Only admins can create/update/delete classrooms
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]


class SystemSettingsViewSet(viewsets.ViewSet):
    """
    ViewSet for managing system-wide settings like current semester
    """
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'], url_path='current-semester')
    def get_current_semester(self, request):
        """
        Get the current active semester
        Available to all authenticated users
        """
        settings = SystemSettings.get_settings()
        return Response({
            'current_semester': settings.current_semester,
            'academic_year': settings.academic_year,
            'updated_at': settings.updated_at
        })
    
    @action(detail=False, methods=['post'], url_path='update-semester', permission_classes=[permissions.IsAdminUser])
    def update_semester(self, request):
        """
        Update the current active semester
        Admin only
        """
        semester = request.data.get('semester')
        academic_year = request.data.get('academic_year')
        
        if not semester or semester not in [1, 2]:
            return Response(
                {'error': 'Invalid semester. Must be 1 or 2.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        settings = SystemSettings.get_settings()
        settings.current_semester = semester
        if academic_year:
            settings.academic_year = academic_year
        settings.save()
        
        return Response({
            'message': 'Semester updated successfully',
            'current_semester': settings.current_semester,
            'academic_year': settings.academic_year
        })

