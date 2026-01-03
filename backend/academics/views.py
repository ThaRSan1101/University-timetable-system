from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Course, Subject, Classroom, SystemSettings, Assessment
from .serializers import CourseSerializer, SubjectSerializer, ClassroomSerializer, AssessmentSerializer
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
        
        # Lecturers see only their assigned subjects
        elif user.role == 'lecturer':
            queryset = queryset.filter(lecturer=user)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def grouped(self, request):
        """
        Get subjects grouped by semester for the current user
        Supports optional year filtering via query param
        """
        user = request.user
        year_param = request.query_params.get('year')
        
        # Get subjects based on user role
        if user.role == 'student' and hasattr(user, 'student_profile'):
            if not user.student_profile.course:
                return Response({'semesters': []})
            subjects = Subject.objects.filter(course=user.student_profile.course)
        elif user.role == 'lecturer':
            subjects = Subject.objects.filter(lecturer=user)
        else:
            subjects = Subject.objects.all()
        
        # Apply year filtering if provided
        if year_param:
            try:
                year = int(year_param)
                # Filter by first digit of subject code (e.g., CST101 -> year 1)
                subjects = [s for s in subjects if s.code and len(s.code) > 3 and s.code[3].isdigit() and int(s.code[3]) == year]
            except (ValueError, IndexError):
                pass
        
        # Group by semester
        grouped = defaultdict(list)
        for subject in subjects:
            grouped[subject.semester].append({
                'id': subject.id,
                'name': subject.name,
                'code': subject.code,
                'semester': subject.semester,
                'weekly_hours': subject.weekly_hours,
                'course_name': subject.course.name if subject.course else None,
                'lecturer_name': subject.lecturer.username if subject.lecturer else 'TBA'
            })
        
        result = [
            {'semester': sem, 'subjects': subjs}
            for sem, subjs in sorted(grouped.items())
        ]
        
        return Response({'semesters': result})


class ClassroomViewSet(viewsets.ModelViewSet):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer
    permission_classes = [permissions.IsAuthenticated]


class SystemSettingsViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        """
        Get current system settings
        """
        settings = SystemSettings.get_settings()
        return Response({
            'current_semester': settings.current_semester,
            'academic_year': settings.academic_year,
            'is_timetable_published': settings.is_timetable_published,
            'updated_at': settings.updated_at
        })
    
    @action(detail=False, methods=['post'])
    def update_semester(self, request):
        """
        Update current semester and academic year
        Only admins can do this
        """
        if request.user.role != 'admin':
            return Response(
                {'error': 'Only admins can update semester settings'},
                status=status.HTTP_403_FORBIDDEN
            )
        
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

    @action(detail=False, methods=['post'])
    def publish_timetable(self, request):
        """
        Toggle timetable publication status
        Only admins can do this
        """
        if request.user.role != 'admin':
            return Response(
                {'error': 'Only admins can publish timetable'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        publish = request.data.get('publish')
        
        if publish is None:
             return Response(
                {'error': 'Publish status is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        settings = SystemSettings.get_settings()
        settings.is_timetable_published = publish
        settings.save()
        
        status_msg = "published" if publish else "unpublished"
        return Response({
            'message': f'Timetable {status_msg} successfully',
            'is_timetable_published': settings.is_timetable_published
        })


class AssessmentViewSet(viewsets.ModelViewSet):
    serializer_class = AssessmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Filter assessments based on user role
        - Lecturers see only their own assessments
        - Students see assessments for their subjects
        - Admins see all assessments
        """
        user = self.request.user
        
        if user.role == 'lecturer':
            return Assessment.objects.filter(lecturer=user).select_related('subject', 'subject__course', 'lecturer')
        elif user.role == 'student' and hasattr(user, 'student_profile'):
            if user.student_profile.course:
                return Assessment.objects.filter(
                    subject__course=user.student_profile.course
                ).select_related('subject', 'subject__course', 'lecturer')
        elif user.role == 'admin':
            return Assessment.objects.all().select_related('subject', 'subject__course', 'lecturer')
        
        return Assessment.objects.none()
    
    def perform_create(self, serializer):
        """
        Automatically set the lecturer to the current user
        """
        serializer.save(lecturer=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_subjects(self, request):
        """
        Get subjects assigned to the current lecturer for assessment creation
        """
        if request.user.role != 'lecturer':
            return Response(
                {'error': 'Only lecturers can access this endpoint'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        subjects = Subject.objects.filter(lecturer=request.user).select_related('course')
        
        subject_data = [{
            'id': subject.id,
            'code': subject.code,
            'name': subject.name,
            'course_name': subject.course.name,
            'course_code': subject.course.code,
            'semester': subject.semester,
            # Extract year from subject code (e.g., CST101 -> 1, CST201 -> 2)
            'year': int(subject.code[3]) if len(subject.code) > 3 and subject.code[3].isdigit() else None
        } for subject in subjects]
        
        return Response(subject_data)
