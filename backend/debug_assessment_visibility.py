import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'university_timetable.settings')
django.setup()

from django.contrib.auth import get_user_model
from academics.models import Assessment, Subject, Course
from users.models import StudentProfile

User = get_user_model()

def check_visibility():
    print("--- DEBUGGING ASSESSMENT VISIBILITY ---")
    
    # 1. Find the 3rd Year Student
    students = User.objects.filter(role='student')
    print(f"\nFound {students.count()} students. Searching for CST Year 3...")
    target_student = None
    for s in students:
        if hasattr(s, 'student_profile'):
            p = s.student_profile
            course_code = p.course.code if p.course else "None"
            if p.year == 3 and 'CST' in (course_code or ''):
                target_student = s
                break # Stop after finding one
    
    if not target_student:
        print("\nERROR: Could not find a 'CST 3rd Year' student automatically. Using first student found if any.")
        if students.exists():
            target_student = students.first()
    
    if target_student:
        p = target_student.student_profile
        year = p.year
        course = p.course
        print(f"\nSelected Student: {target_student.email}")
        print(f" - Course: {course.name if course else 'None'} ({course.code if course else 'None'})")
        print(f" - Year: {year}")
        
        # Calculate Expected Semesters
        target_semesters = [(year - 1) * 2 + 1, (year - 1) * 2 + 2]
        print(f" - CALCULATED Target Semesters: {target_semesters}")
        
        # 2. Check Assessments
        print(f"\nChecking Assessments for Course '{course.name if course else 'None'}':")
        assessments = Assessment.objects.filter(subject__course=course)
        
        if not assessments.exists():
            print(" - No assessments found for this course AT ALL.")
        
        for a in assessments:
            subj = a.subject
            is_visible = subj.semester in target_semesters
            print(f"\n [Assessment ID: {a.id}] '{a.title}'")
            print(f"   - Subject: {subj.name} ({subj.code})")
            print(f"   - Subject Semester: {subj.semester}")
            print(f"   - VISIBLE? {'YES' if is_visible else 'NO'} (Subject Semester {subj.semester} in {target_semesters}?)")
            
            if not is_visible:
                print("   -> FAIL: Assessment hidden because Subject Semester does not match Student Year logic.")

    else:
        print("No students found to debug.")

if __name__ == '__main__':
    check_visibility()
