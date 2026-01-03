from academics.models import Subject, Classroom, SystemSettings
from timetable.models import TimetableSlot
from django.db.models import Q
import datetime

def get_year_from_code(code):
    """
    Extract year level from subject code (e.g., CST101 -> 1, CST201 -> 2)
    Defaults to 1 if parsing fails.
    """
    if code and len(code) > 3 and code[3].isdigit():
        return int(code[3])
    return 1

def generate_timetable_algo():
    """
    Enhanced timetable generator with comprehensive conflict detection.
    
    Rules Implemented:
    1. Semester Filtering: Only schedules subjects for the ACTIVE semester.
    2. Operating Hours: Mon-Fri, 08:00 - 17:00.
    3. Break Times:
       - Year 1: 12:00 - 13:00
       - Year 2/3/4: 13:00 - 14:00
    4. Room Availability:
       - Must be Active (is_active=True)
       - Must match Room Type (Lecture Hall / Computer Lab)
       - Must have sufficient capacity (assumed default batch size = 30)
       - No double booking.
    5. Lecturer Availability:
       - No double booking for lecturers.
    6. Student Group Availability:
       - No double booking for students (Course + Year/Semester).
    """
    
    # Clear existing timetable for regeneration
    TimetableSlot.objects.all().delete()
    
    # Get active semester from settings
    try:
        settings = SystemSettings.objects.first()
        current_semester = settings.current_semester if settings else 1
    except:
        current_semester = 1 # Fallback
        
    # Get subjects for the CURRENT SEMESTER only
    # This significantly reduces conflicts by not scheduling off-semester classes
    subjects = Subject.objects.filter(semester=current_semester).order_by('-weekly_hours')
    
    # Filter for ACTIVE rooms only
    classrooms = list(Classroom.objects.filter(is_active=True))
    
    # Track scheduling results
    unscheduled = []
    scheduled_count = 0
    
    # Define time constraints
    START_HOUR = 8  # 8 AM
    END_HOUR = 17   # 5 PM (classes end at 17:00, so last slot starts at 16:00)
    DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    
    # Default student batch size assumption (since not in Subject model)
    DEFAULT_BATCH_SIZE = 30
    
    for subject in subjects:
        hours_needed = subject.weekly_hours
        hours_scheduled = 0
        
        # Determine Year Level for Break Time Logic
        year_level = get_year_from_code(subject.code)
        
        # Determine Break Hour
        # Year 1: 12:00 - 13:00
        # Others: 13:00 - 14:00
        break_hour = 12 if year_level == 1 else 13
        
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
                    
                    # ===== CONFLICT CHECK 1: Break Times =====
                    if hour == break_hour:
                        continue
                    
                    start_time = datetime.time(hour, 0)
                    end_time_val = datetime.time(hour + 1, 0)
                    
                    # ===== CONFLICT CHECK 2: Lecturer Availability =====
                    if subject.lecturer:
                        lecturer_busy = TimetableSlot.objects.filter(
                            subject__lecturer=subject.lecturer,
                            day=day,
                            start_time=start_time
                        ).exists()
                        
                        if lecturer_busy:
                            continue  # Lecturer has another class
                    
                    # ===== CONFLICT CHECK 3: Student Group Availability =====
                    # Students in the same Course + Semester + Year cannot be in two places
                    # We approximate "Student Group" using Course + Semester + Code Year
                    
                    # Find slots for same course & semester
                    potential_clashes = TimetableSlot.objects.filter(
                        subject__course=subject.course,
                        subject__semester=subject.semester,
                        day=day,
                        start_time=start_time
                    )
                    
                    # Filter further by Year (don't block Year 1 if Year 2 has class)
                    group_busy = False
                    for slot in potential_clashes:
                        slot_year = get_year_from_code(slot.subject.code)
                        if slot_year == year_level:
                            group_busy = True
                            break
                    
                    if group_busy:
                        continue
                    
                    # ===== CONFLICT CHECK 4: Find Available Room =====
                    required_room_type = subject.room_type
                    
                    for room in classrooms:
                        # 4a. Check Room Type Matching
                        # Strict check based on Subject preference
                        if room.room_type != required_room_type:
                            continue
                            
                        # 4b. Check Capacity
                        if room.capacity < DEFAULT_BATCH_SIZE:
                            continue
                            
                        # 4c. Check Room Availability (Double Booking)
                        room_busy = TimetableSlot.objects.filter(
                            classroom=room,
                            day=day,
                            start_time=start_time
                        ).exists()
                        
                        if room_busy:
                            continue
                        
                        # ALL CHECKS PASSED - Assign Slot
                        TimetableSlot.objects.create(
                            subject=subject,
                            classroom=room,
                            day=day,
                            start_time=start_time,
                            end_time=end_time_val
                        )
                        placed = True
                        hours_scheduled += 1
                        scheduled_count += 1
                        break # Break room loop
            
        # End of subject scheduling loop
        
        # Track subjects that couldn't be fully scheduled
        if hours_scheduled < hours_needed:
            unscheduled.append({
                'subject': subject.name,
                'code': subject.code,
                'course': subject.course.name if subject.course else 'N/A',
                'semester': subject.semester,
                'year': year_level,
                'needed': hours_needed,
                'scheduled': hours_scheduled,
                'missing': hours_needed - hours_scheduled,
                'reason': _diagnose_failure(subject, classrooms, year_level)
            })
    
    return {
        'unscheduled': unscheduled,
        'total_subjects': subjects.count(),
        'fully_scheduled': subjects.count() - len(unscheduled),
        'total_slots_created': scheduled_count
    }

def _diagnose_failure(subject, classrooms, year_level):
    """
    Helper function to provide user-friendly error messages
    """
    # Check Active Rooms
    suitable_rooms = [r for r in classrooms if r.room_type == subject.room_type and r.is_active]
    if not suitable_rooms:
        return f"No active {subject.room_type}s available with sufficient capacity"
    
    # Check Lecturer
    if not subject.lecturer:
        return "No lecturer assigned to subject"
        
    return "Schedule conflict: No common free slots for Lecturer, Room, and Student Group"

