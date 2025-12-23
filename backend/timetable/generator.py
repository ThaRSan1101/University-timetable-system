from academics.models import Subject, Classroom
from timetable.models import TimetableSlot
from django.db.models import Q
import datetime

def generate_timetable_algo():
    # Clear existing timetable? Or just append? Usually clear for regeneration.
    # For this demo, let's assume we clear everything or specific course.
    # Let's clear all for simplicity as it's a "Generate" button.
    TimetableSlot.objects.all().delete()
    
    subjects = Subject.objects.all().order_by('priority', '-weekly_hours') # High priority first
    classrooms = Classroom.objects.all()
    
    unscheduled = []
    
    # Define time slots: 8 AM to 5 PM (17:00)
    # 1 hour slots
    start_hour = 8
    end_hour = 17
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    
    for subject in subjects:
        hours_needed = subject.weekly_hours
        hours_scheduled = 0
        
        # Try to schedule each hour
        for _ in range(hours_needed):
            placed = False
            
            for day in days:
                if placed: break
                
                for hour in range(start_hour, end_hour):
                    if placed: break
                    
                    start_time = datetime.time(hour, 0)
                    end_time = datetime.time(hour + 1, 0)
                    
                    # 1. Check Lunch Break
                    # 1st Year: 12-1
                    # Others: 1-2 (13-14)
                    if subject.year == 1 and hour == 12:
                        continue
                    if subject.year > 1 and hour == 13:
                        continue
                        
                    # 2. Check Lecturer Availability
                    if subject.lecturer:
                        lecturer_busy = TimetableSlot.objects.filter(
                            subject__lecturer=subject.lecturer,
                            day=day,
                            start_time=start_time
                        ).exists()
                        if lecturer_busy:
                            continue
                            
                    # 3. Check Student Group Availability (Course + Year + Sem)
                    group_busy = TimetableSlot.objects.filter(
                        subject__course=subject.course,
                        subject__year=subject.year,
                        subject__semester=subject.semester,
                        day=day,
                        start_time=start_time
                    ).exists()
                    if group_busy:
                        continue
                        
                    # 4. Find a Classroom
                    # Must match type (Lecture/Lab) and Capacity (assume infinite for now or check?)
                    # Let's just pick any available room of correct type.
                    # We don't have student count in Subject, so we ignore capacity for now or assume it fits.
                    # We need to distinguish Lecture vs Lab. Subject doesn't say type.
                    # Let's assume all are Lectures for now unless specified.
                    # Or maybe add 'type' to Subject? Prompt didn't specify, but Classroom has type.
                    # Let's assume 'Lecture' type for defaults.
                    
                    required_type = 'lecture' # Default
                    # If we had subject type, we'd use it.
                    
                    available_room = None
                    for room in classrooms:
                        if room.room_type != required_type:
                            continue
                            
                        room_busy = TimetableSlot.objects.filter(
                            classroom=room,
                            day=day,
                            start_time=start_time
                        ).exists()
                        
                        if not room_busy:
                            available_room = room
                            break
                    
                    if available_room:
                        # Book it
                        TimetableSlot.objects.create(
                            subject=subject,
                            classroom=available_room,
                            day=day,
                            start_time=start_time,
                            end_time=end_time
                        )
                        placed = True
                        hours_scheduled += 1
            
        if hours_scheduled < hours_needed:
            unscheduled.append({
                'subject': subject.name,
                'needed': hours_needed,
                'scheduled': hours_scheduled
            })
            
    return unscheduled
