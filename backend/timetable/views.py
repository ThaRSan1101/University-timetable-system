from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import TimetableSlot
from .serializers import TimetableSlotSerializer
from .generator import generate_timetable_algo

class TimetableViewSet(viewsets.ModelViewSet):
    queryset = TimetableSlot.objects.all()
    serializer_class = TimetableSlotSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Filter by course/year/semester if provided
        course_id = self.request.query_params.get('course_id')
        year = self.request.query_params.get('year')
        semester = self.request.query_params.get('semester')
        lecturer_id = self.request.query_params.get('lecturer_id')
        
        if course_id:
            queryset = queryset.filter(subject__course_id=course_id)
        if year:
            queryset = queryset.filter(subject__year=year)
        if semester:
            queryset = queryset.filter(subject__semester=semester)
        if lecturer_id:
            queryset = queryset.filter(subject__lecturer_id=lecturer_id)
            
        return queryset

    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def generate(self, request):
        unscheduled = generate_timetable_algo()
        if unscheduled:
            return Response({
                'status': 'completed_with_conflicts',
                'unscheduled': unscheduled
            }, status=status.HTTP_200_OK)
        return Response({'status': 'success'}, status=status.HTTP_200_OK)
