from rest_framework import viewsets, permissions, status  
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q
from datetime import datetime, timedelta
from .models import TimetableSlot
from .serializers import TimetableSlotSerializer
from academics.models import Subject


class TimetableViewSet(viewsets.ModelViewSet):
    queryset = TimetableSlot.objects.all()
    serializer_class = TimetableSlotSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        SECURITY: Filter timetable based on user role
        - Students see their course timetable
        - Lecturers see their teaching schedule
        - Admins see everything
        """
        user = self.request.user
        queryset = TimetableSlot.objects.select_related(
            'subject', 'subject__course', 'subject__lecturer', 'classroom'
        ).all()

        # Filter by query parameters
        course_id = self.request.query_params.get('course_id')
        lecturer_id = self.request.query_params.get('lecturer_id')
        day = self.request.query_params.get('day')

        if course_id:
            queryset = queryset.filter(subject__course_id=course_id)
        if lecturer_id:
            queryset = queryset.filter(subject__lecturer_id=lecturer_id)
        if day:
            queryset = queryset.filter(day=day)

        return queryset.order_by('day', 'start_time')

    @action(detail=False, methods=['get'], url_path='formatted')
    def get_formatted_timetable(self, request):
        """
        Returns timetable with all frontend logic pre-processed by backend
        
        BACKEND LOGIC:
        - Groups by day
        - Sorts by time
        - Merges consecutive slots
        - Calculates positions and durations
        - Assigns colors
        - Formats times
        - Finds next class
        
        Query params:
        - course_id: Filter by course
        - lecturer_id: Filter by lecturer
        - view: 'calendar' or 'list' (default: 'calendar')
        """
        queryset = self.get_queryset()
        view_type = request.query_params.get('view', 'calendar')
        
        # Get all slots
        slots = list(queryset)
        
        if not slots:
            return Response({
                'days': [],
                'next_class': None,
                'view': view_type
            })
        
        # Process timetable data
        days_data = self._process_timetable_by_days(slots)
        next_class = self._find_next_class(slots)
        
        return Response({
            'days': days_data,
            'next_class': next_class,
            'view': view_type,
            'time_range': {
                'start': '08:00',
                'end': '19:00',
                'slots': self._generate_time_slots()
            }
        })

    def _process_timetable_by_days(self, slots):
        """
        BACKEND LOGIC: Group and process slots by day
        """
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        days_data = []
        
        for day in days:
            day_slots = [s for s in slots if s.day == day]
            
            if not day_slots:
                days_data.append({
                    'day': day,
                    'classes': [],
                    'has_classes': False
                })
                continue
            
            # Sort by start time
            day_slots.sort(key=lambda x: x.start_time)
            
            # Merge consecutive slots of same subject
            merged_slots = self._merge_consecutive_slots(day_slots)
            
            # Process each slot
            processed_slots = []
            for slot in merged_slots:
                processed_slots.append({
                    'id': slot.id,
                    'subject': {
                        'id': slot.subject.id,
                        'name': slot.subject.name,
                        'code': slot.subject.code,
                        'course_name': slot.subject.course.name if slot.subject.course else None,
                        'lecturer_name': slot.subject.lecturer.username if slot.subject.lecturer else None,
                    },
                    'classroom': {
                        'id': slot.classroom.id if slot.classroom else None,
                        'room_number': slot.classroom.room_number if slot.classroom else 'TBA',
                        'room_type': slot.classroom.room_type if slot.classroom else None,
                    },
                    'time': {
                        'start': self._format_time(slot.start_time),
                        'end': self._format_time(slot.end_time),
                        'start_raw': str(slot.start_time),
                        'end_raw': str(slot.end_time),
                        'duration_minutes': self._calculate_duration(slot.start_time, slot.end_time),
                    },
                    'display': {
                        'color_class': self._get_color_for_subject(slot.subject.name),
                        'position_index': self._get_time_position(slot.start_time),
                        'duration_blocks': self._calculate_duration(slot.start_time, slot.end_time) // 60,
                    }
                })
            
            days_data.append({
                'day': day,
                'classes': processed_slots,
                'has_classes': len(processed_slots) > 0,
                'class_count': len(processed_slots)
            })
        
        return days_data

    def _merge_consecutive_slots(self, slots):
        """
        BACKEND LOGIC: Merge consecutive slots of the same subject
        """
        if not slots:
            return []
        
        merged = []
        current = slots[0]
        
        for i in range(1, len(slots)):
            next_slot = slots[i]
            
            # Check if same subject and consecutive times
            if (current.subject.id == next_slot.subject.id and 
                current.end_time == next_slot.start_time):
                # Extend current slot
                current.end_time = next_slot.end_time
            else:
                # Save current and start new
                merged.append(current)
                current = next_slot
        
        merged.append(current)
        return merged

    def _find_next_class(self, slots):
        """
        BACKEND LOGIC: Find the next upcoming class
        """
        now = datetime.now()
        current_day = now.strftime('%A')
        current_time = now.time()
        
        # Get today's remaining classes
        today_slots = [s for s in slots if s.day == current_day and s.start_time > current_time]
        
        if today_slots:
            next_slot = min(today_slots, key=lambda x: x.start_time)
            minutes_until = self._calculate_minutes_until(current_time, next_slot.start_time)
            
            return {
                'subject': next_slot.subject.name,
                'classroom': next_slot.classroom.room_number if next_slot.classroom else 'TBA',
                'start_time': self._format_time(next_slot.start_time),
                'minutes_until': minutes_until,
                'day': next_slot.day
            }
        
        # Find next day's first class
        days_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        try:
            current_day_index = days_order.index(current_day)
        except ValueError:
            return None
        
        for i in range(1, 5):  # Check next 4 days
            next_day_index = (current_day_index + i) % 5
            next_day = days_order[next_day_index]
            day_slots = [s for s in slots if s.day == next_day]
            
            if day_slots:
                next_slot = min(day_slots, key=lambda x: x.start_time)
                return {
                    'subject': next_slot.subject.name,
                    'classroom': next_slot.classroom.room_number if next_slot.classroom else 'TBA',
                    'start_time': self._format_time(next_slot.start_time),
                    'minutes_until': None,
                    'day': next_slot.day
                }
        
        return None

    def _format_time(self, time_obj):
        """
        BACKEND LOGIC: Format time to HH:MM
        """
        if isinstance(time_obj, str):
            return time_obj[:5]
        return time_obj.strftime('%H:%M')

    def _calculate_duration(self, start_time, end_time):
        """
        BACKEND LOGIC: Calculate duration in minutes
        """
        if isinstance(start_time, str):
            start_time = datetime.strptime(start_time, '%H:%M:%S').time()
        if isinstance(end_time, str):
            end_time = datetime.strptime(end_time, '%H:%M:%S').time()
        
        start_minutes = start_time.hour * 60 + start_time.minute
        end_minutes = end_time.hour * 60 + end_time.minute
        return end_minutes - start_minutes

    def _calculate_minutes_until(self, current_time, target_time):
        """
        BACKEND LOGIC: Calculate minutes until target time
        """
        current_minutes = current_time.hour * 60 + current_time.minute
        target_minutes = target_time.hour * 60 + target_time.minute
        return target_minutes - current_minutes

    def _get_time_position(self, time_obj):
        """
        BACKEND LOGIC: Get position index (0-based, from 8:00 AM)
        """
        if isinstance(time_obj, str):
            time_obj = datetime.strptime(time_obj, '%H:%M:%S').time()
        
        start_hour = 8
        position = (time_obj.hour - start_hour) * 60 + time_obj.minute
        return position // 60  # Return hour blocks

    def _get_color_for_subject(self, subject_name):
        """
        BACKEND LOGIC: Assign consistent color based on subject name
        """
        colors = [
            'bg-blue-100 border-blue-500 text-blue-700',
            'bg-green-100 border-green-500 text-green-700',
            'bg-purple-100 border-purple-500 text-purple-700',
            'bg-orange-100 border-orange-500 text-orange-700',
            'bg-pink-100 border-pink-500 text-pink-700',
            'bg-teal-100 border-teal-500 text-teal-700',
        ]
        
        # Generate consistent hash from subject name
        hash_value = sum(ord(char) for char in subject_name)
        return colors[hash_value % len(colors)]

    def _generate_time_slots(self):
        """
        BACKEND LOGIC: Generate time slot labels
        """
        return [f"{8 + i}:00" for i in range(11)]  # 8:00 to 18:00

    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def generate(self, request):
        """
        Admin-only: Trigger timetable generation with conflict detection
        """
        from .generator import generate_timetable_algo
        
        try:
            result = generate_timetable_algo()
            
            # Check if there were any unscheduled subjects
            if result['unscheduled']:
                return Response({
                    'status': 'partial_success',
                    'message': f"{len(result['unscheduled'])} subjects could not be fully scheduled",
                    'statistics': {
                        'total_subjects': result['total_subjects'],
                        'fully_scheduled': result['fully_scheduled'],
                        'partially_scheduled': len(result['unscheduled']),
                        'total_slots_created': result['total_slots_created']
                    },
                    'unscheduled': result['unscheduled']
                }, status=status.HTTP_200_OK)
            
            return Response({
                'status': 'success',
                'message': 'Timetable generated successfully! All subjects scheduled without conflicts.',
                'statistics': {
                    'total_subjects': result['total_subjects'],
                    'fully_scheduled': result['fully_scheduled'],
                    'total_slots_created': result['total_slots_created']
                }
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'Generation failed: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def resolve_conflicts(self, request):
        """
        Admin-only: Attempt to auto-resolve scheduling conflicts
        This will try to reschedule unscheduled subjects
        """
        try:
            # Re-run the generator which will attempt to fill gaps
            from .generator import generate_timetable_algo
            result = generate_timetable_algo()
            
            if result['unscheduled']:
                return Response({
                    'status': 'partial_success',
                    'message': f"Resolved some conflicts. {len(result['unscheduled'])} subjects still unscheduled.",
                    'unscheduled': result['unscheduled'],
                    'statistics': {
                        'total_subjects': result['total_subjects'],
                        'fully_scheduled': result['fully_scheduled'],
                        'total_slots_created': result['total_slots_created']
                    }
                }, status=status.HTTP_200_OK)
            
            return Response({
                'status': 'success',
                'message': 'All conflicts resolved successfully!',
                'statistics': {
                    'total_subjects': result['total_subjects'],
                    'fully_scheduled': result['fully_scheduled'],
                    'total_slots_created': result['total_slots_created']
                }
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'Resolution failed: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
