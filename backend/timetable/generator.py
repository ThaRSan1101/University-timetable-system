from academics.models import Subject, Classroom
from timetable.models import TimetableSlot
from django.db.models import Q
import datetime

def generate_timetable_algo():
    """
    Enhanced timetable generator with comprehensive conflict detection
    
    Prevents:
    - Room double booking
    - Room type mismatch (lab subjects in lecture halls)
    - Lecturer clashes
    - Student clashes
    - Time violations (outside operating hours, lunch breaks)
    """
    
    # Clear existing timetable for regeneration
    TimetableSlot.objects.all().delete()
    
    # Get all subjects sorted by weekly_hours (descending)
    subjects = Subject.objects.all().order_by('-weekly_hours')
    classrooms = list(Classroom.objects.all())
    
    # Track scheduling results
    unscheduled = []
    scheduled_count = 0
    
    # Define time constraints
    START_HOUR = 8  # 8 AM
    END_HOUR = 17   # 5 PM
    DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    
    # Global lunch break
    LUNCH_HOUR = 12
    
    for subject in subjects:
        hours_needed = subject.weekly_hours
        hours_scheduled = 0
        
        # Try to schedule each hour for this subject
        for _ in range(hours_needed):
            placed = False
            
            # Try each day
            for day in DAYS:
                if placed:
                    break
                
                # Try each hour slot
                for hour in range(START_HOUR, END_HOUR):
                    if placed:
                        break
                    
                    start_time = datetime.time(hour, 0)
                    end_time = datetime.time(hour + 1, 0)
                    
                    # ===== CONFLICT CHECK 1: Time Violations =====
                    # Check lunch break
                    if hour == LUNCH_HOUR:
                        continue  # Skip lunch hour
                    
                    # ===== CONFLICT CHECK 2: Lecturer Availability =====
                    if subject.lecturer:
                        lecturer_busy = TimetableSlot.objects.filter(
                            subject__lecturer=subject.lecturer,
                            day=day,
                            start_time=start_time
                        ).exists()
                        
                        if lecturer_busy:
                            continue  # Lecturer has another class at this time
                    
                    # ===== CONFLICT CHECK 3: Student Group Availability =====
                    # Students in same course and semester can't have multiple classes
                    student_group_busy = TimetableSlot.objects.filter(
                        subject__course=subject.course,
                        subject__semester=subject.semester,
                        day=day,
                        start_time=start_time
                    ).exists()
                    
                    if student_group_busy:
                        continue  # Students already have a class at this time
                    
                    # ===== CONFLICT CHECK 4: Room Type Matching =====
                    # checking type based on model field
                    required_room_type = subject.room_type
                    
                    # ===== CONFLICT CHECK 5: Find Available Room =====
                    available_room = None
                    
                    for room in classrooms:
                        # Check room type matches subject requirement (flexible matching)
                        # Normalize to lower case for comparison if data is inconsistent
                        r_type_db = room.room_type.lower()
                        r_type_req = required_room_type.lower()
                        
                        # Handle mapping if 'Lecture Hall' vs 'lecture'
                        if 'lecture' in r_type_req and 'lecture' not in r_type_db:
                           continue
                        if 'lab' in r_type_req and 'lab' not in r_type_db:
                           continue
                        
                        # Check if room is already booked at this time
                        room_busy = TimetableSlot.objects.filter(
                            classroom=room,
                            day=day,
                            start_time=start_time
                        ).exists()
                        
                        if room_busy:
                            continue  # Room already booked
                        
                        # ===== OPTIONAL: Check Room Capacity =====
                        # Assuming ~30 students (can be made configurable)
                        estimated_students = 30
                        if room.capacity < estimated_students:
                            continue  # Room too small
                        
                        # All checks passed! This room is suitable
                        available_room = room
                        break
                    
                    # ===== ASSIGN SLOT IF ROOM FOUND =====
                    if available_room:
                        TimetableSlot.objects.create(
                            subject=subject,
                            classroom=available_room,
                            day=day,
                            start_time=start_time,
                            end_time=end_time
                        )
                        placed = True
                        hours_scheduled += 1
                        scheduled_count += 1
        
        # Track subjects that couldn't be fully scheduled
        if hours_scheduled < hours_needed:
            unscheduled.append({
                'subject': subject.name,
                'code': subject.code,
                'course': subject.course.name,
                'semester': subject.semester,
                'needed': hours_needed,
                'scheduled': hours_scheduled,
                'missing': hours_needed - hours_scheduled,
                'reason': _diagnose_scheduling_failure(subject, classrooms)
            })
    
    return {
        'unscheduled': unscheduled,
        'total_subjects': subjects.count(),
        'fully_scheduled': subjects.count() - len(unscheduled),
        'total_slots_created': scheduled_count
    }


def _diagnose_scheduling_failure(subject, classrooms):
    """
    Helper function to diagnose why a subject couldn't be scheduled
    """
    required_type = 'lab' if 'lab' in subject.name.lower() else 'lecture'
    suitable_rooms = [r for r in classrooms if r.room_type == required_type]
    
    if not suitable_rooms:
        return f"No {required_type} rooms available"
    
    if not subject.lecturer:
        return "No lecturer assigned"
    
    # Check if lecturer is overloaded
    lecturer_hours = sum(s.weekly_hours for s in subject.lecturer.subjects.all())
    if lecturer_hours > 20:
        return f"Lecturer overloaded ({lecturer_hours}h/week)"
    
    return "Insufficient time slots (conflicts with other classes)"

