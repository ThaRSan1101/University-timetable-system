import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'university_timetable.settings')
django.setup()

from django.contrib.auth import get_user_model
from academics.models import Course, Classroom, Subject
from users.models import LecturerProfile, StudentProfile

User = get_user_model()

def seed():
    # Create Admin
    if not User.objects.filter(email='admin@university.com').exists():
        User.objects.create_superuser('admin', 'admin@university.com', 'admin123', role='admin')
        print("Admin created: admin@university.com / admin123")
    
    # Create Lecturer
    if not User.objects.filter(email='lecturer@university.com').exists():
        lecturer = User.objects.create_user('lecturer', 'lecturer@university.com', 'lecturer123', role='lecturer')
        LecturerProfile.objects.create(user=lecturer, faculty='Engineering', department='Computer Science')
        print("Lecturer created: lecturer@university.com / lecturer123")

    # Create Course
    course, created = Course.objects.get_or_create(name='Computer Science', code='CS')
    
    # Create Student
    if not User.objects.filter(email='student@university.com').exists():
        student = User.objects.create_user('student', 'student@university.com', 'student123', role='student')
        StudentProfile.objects.create(user=student, course=course, year=1, semester=1)
        print("Student created: student@university.com / student123")

    # Create Classrooms
    Classroom.objects.get_or_create(room_number='101', room_type='lecture', capacity=50)
    Classroom.objects.get_or_create(room_number='LAB-1', room_type='lab', capacity=30)
    
    # Create Subjects
    lecturer = User.objects.get(email='lecturer@university.com')
    Subject.objects.get_or_create(
        name='Intro to Programming',
        code='CS101',
        course=course,
        year=1,
        semester=1,
        weekly_hours=3,
        priority=1,
        lecturer=lecturer
    )
    Subject.objects.get_or_create(
        name='Data Structures',
        code='CS102',
        course=course,
        year=1,
        semester=1,
        weekly_hours=3,
        priority=2,
        lecturer=lecturer
    )
    
    print("Seeding complete.")

if __name__ == '__main__':
    seed()
