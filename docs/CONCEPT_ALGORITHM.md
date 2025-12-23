# Timetable Generation Algorithm Explained

This document explains the "Brain" of the system: How we automatically schedule classes without conflicts.

## **The Problem**

We need to assign **Subjects** to **Classrooms** at specific **Times** while obeying these rules:

1. **Lecturer Clash**: A lecturer cannot teach two classes at the same time.
2. **Room Clash**: A room cannot host two classes at the same time.
3. **Student Clash**: A student group (e.g., Year 1 CS) cannot have two classes at the same time.
4. **Lunch Break**: No classes during lunch hours (12-1 PM for Year 1, 1-2 PM for others).

## **The Solution: Greedy Heuristic Algorithm**

We use a "Greedy" approach. This means we try to schedule the "hardest" subjects first (High Priority) to ensure they get a spot.

### **Step-by-Step Logic (`backend/timetable/generator.py`)**

#### **1. Preparation**

* Fetch all **Subjects** that need to be scheduled.
* Sort them by **Priority** (Highest first) and **Weekly Hours** (Longest first).
* Fetch all available **Classrooms**.

#### **2. The Loop (Try to fit each subject)**

We take the first subject from the list and try to find a "Slot" for it.

```python
for subject in subjects:
    scheduled = False
    
    # Try every Day (Mon-Fri)
    for day in ['Monday', 'Tuesday', ...]:
    
        # Try every Hour (8 AM - 5 PM)
        for hour in range(8, 17):
            
            # CHECK 1: Is it Lunch Time?
            if is_lunch_break(subject.year, hour):
                continue (Skip this hour)

            # CHECK 2: Is the Room Free?
            if not is_room_free(room, day, hour):
                continue

            # CHECK 3: Is the Lecturer Free?
            if not is_lecturer_free(subject.lecturer, day, hour):
                continue
            
            # CHECK 4: Is the Student Group Free?
            if not is_group_free(subject.course, subject.year, day, hour):
                continue

            # SUCCESS! All checks passed.
            # Book the slot in the database.
            create_timetable_slot(subject, room, day, hour)
            scheduled = True
            break (Stop looking for this subject)
```

#### **3. Handling Failures**

If the loop finishes all days and hours and `scheduled` is still `False`:

* The subject is added to a list called `unscheduled_subjects`.
* The Admin sees this list on the dashboard so they can manually fix it (e.g., by adding more rooms).

---

## **Key Functions**

### **`check_clash(day, start_time, end_time, ...)`**

This is a helper function that queries the database to see if a specific resource (Room, Lecturer, or Student Group) is already booked in the `TimetableSlot` table for that specific time range.

### **`generate_timetable()`**

The main function that orchestrates the whole process. It deletes the old timetable (optional) and runs the loop described above.
