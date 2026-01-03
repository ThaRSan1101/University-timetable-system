"""
Database Seeder Script
Creates 20+ classrooms, 50+ lecturers, 300+ students and assigns subjects
All users password: Tharsu@123
"""

import os
import django
import random
from datetime import time

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'university_timetable.settings')
django.setup()

from users.models import User, LecturerProfile, StudentProfile
from academics.models import Classroom, Subject, Course
from django.db import transaction

# Student first names (for generating 300+ students)
FIRST_NAMES = [
    "Aiden", "Amelia", "Benjamin", "Charlotte", "Daniel", "Emma", "Ethan", "Grace",
    "Henry", "Isabella", "Jack", "Lily", "Lucas", "Mia", "Noah", "Olivia",
    "Oliver", "Sophia", "Samuel", "Ava", "William", "Emily", "James", "Abigail",
    "Alexander", "Harper", "Michael", "Ella", "Elijah", "Scarlett", "Logan", "Madison",
    "Mason", "Aria", "Jacob", "Chloe", "Liam", "Layla", "Sebastian", "Zoe",
    "Jackson", "Penelope", "Aiden", "Riley", "Matthew", "Nora", "David", "Lillian",
    "Joseph", "Hannah", "Carter", "Addison", "Owen", "Eleanor", "Wyatt", "Natalie",
    "John", "Luna", "Dylan", "Savannah", "Luke", "Brooklyn", "Gabriel", "Leah",
    "Anthony", "Hazel", "Isaac", "Violet", "Grayson", "Aurora", "Julian", "Audrey"
]

LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas",
    "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White",
    "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young",
    "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
    "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell",
    "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker",
    "Cruz", "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Morales", "Murphy"
]

# Lecturer names (50+ realistic names)
LECTURER_NAMES = [
    "Dr. Sarah Johnson", "Prof. Michael Chen", "Dr. Emily Williams", "Dr. James Brown",
    "Prof. Maria Garcia", "Dr. David Martinez", "Dr. Lisa Anderson", "Prof. Robert Taylor",
    "Dr. Jennifer Thomas", "Dr. Christopher Lee", "Prof. Amanda White", "Dr. Daniel Harris",
    "Dr. Jessica Martin", "Prof. Matthew Thompson", "Dr. Ashley Garcia", "Dr. Joshua Rodriguez",
    "Prof. Stephanie Lewis", "Dr. Andrew Walker", "Dr. Michelle Hall", "Prof. Kevin Allen",
    "Dr. Laura Young", "Dr. Brian King", "Prof. Nicole Wright", "Dr. Ryan Lopez",
    "Dr. Rebecca Hill", "Prof. Justin Scott", "Dr. Samantha Green", "Dr. Brandon Adams",
    "Prof. Megan Baker", "Dr. Tyler Nelson", "Dr. Kimberly Carter", "Prof. Aaron Mitchell",
    "Dr. Christina Perez", "Dr. Jonathan Roberts", "Prof. Heather Turner", "Dr. Nathan Phillips",
    "Dr. Melissa Campbell", "Prof. Eric Parker", "Dr. Rachel Evans", "Dr. Jacob Edwards",
    "Prof. Lauren Collins", "Dr. Alexander Stewart", "Dr. Victoria Sanchez", "Prof. Benjamin Morris",
    "Dr. Brittany Rogers", "Dr. Samuel Reed", "Prof. Danielle Cook", "Dr. Nicholas Morgan",
    "Dr. Amber Bell", "Prof. Kyle Murphy", "Dr. Tiffany Bailey", "Dr. Austin Rivera",
    "Prof. Courtney Cooper", "Dr. Jordan Richardson", "Dr. Taylor Cox", "Prof. Morgan Howard"
]

# Classroom data (20+ rooms)
CLASSROOMS = [
    # Lecture Halls
    {"room_number": "LH-101", "room_type": "Lecture Hall", "capacity": 120},
    {"room_number": "LH-102", "room_type": "Lecture Hall", "capacity": 100},
    {"room_number": "LH-103", "room_type": "Lecture Hall", "capacity": 150},
    {"room_number": "LH-201", "room_type": "Lecture Hall", "capacity": 80},
    {"room_number": "LH-202", "room_type": "Lecture Hall", "capacity": 90},
    {"room_number": "LH-301", "room_type": "Lecture Hall", "capacity": 110},
    {"room_number": "AUDITORIUM", "room_type": "Lecture Hall", "capacity": 200},
    
    # Computer Labs
    {"room_number": "CL-101", "room_type": "Computer Lab", "capacity": 40},
    {"room_number": "CL-102", "room_type": "Computer Lab", "capacity": 35},
    {"room_number": "CL-103", "room_type": "Computer Lab", "capacity": 45},
    {"room_number": "CL-201", "room_type": "Computer Lab", "capacity": 50},
    {"room_number": "CL-202", "room_type": "Computer Lab", "capacity": 40},
    {"room_number": "CL-301", "room_type": "Computer Lab", "capacity": 30},
    {"room_number": "CL-302", "room_type": "Computer Lab", "capacity": 35},
    
    # Regular Classrooms
    {"room_number": "CR-101", "room_type": "Lecture Hall", "capacity": 60},
    {"room_number": "CR-102", "room_type": "Lecture Hall", "capacity": 55},
    {"room_number": "CR-103", "room_type": "Lecture Hall", "capacity": 50},
    {"room_number": "CR-201", "room_type": "Lecture Hall", "capacity": 65},
    {"room_number": "CR-202", "room_type": "Lecture Hall", "capacity": 60},
    {"room_number": "CR-203", "room_type": "Lecture Hall", "capacity": 70},
    {"room_number": "CR-301", "room_type": "Lecture Hall", "capacity": 55},
    {"room_number": "CR-302", "room_type": "Lecture Hall", "capacity": 50},
    {"room_number": "CR-303", "room_type": "Lecture Hall", "capacity": 60},
]

# Course codes for Applied Sciences
COURSE_CODES = ['CST', 'SCT', 'IIT', 'MRT']

# Days and time slots for availability
DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
TIME_SLOTS = ['AM', 'Noon', 'PM']

def generate_random_availability():
    """Generate random but realistic availability for a lecturer"""
    availability = {}
    
    for day in DAYS:
        for slot in TIME_SLOTS:
            # 70% chance of being available
            availability[f"{day}-{slot}"] = random.random() > 0.3
    
    # Ensure at least some availability
    if not any(availability.values()):
        # Make them available on at least 2 random slots
        random_keys = random.sample(list(availability.keys()), 2)
        for key in random_keys:
            availability[key] = True
    
    return availability

def create_classrooms():
    """Create 20+ classrooms"""
    print("\n📚 Creating Classrooms...")
    created = 0
    
    for room_data in CLASSROOMS:
        classroom, created_new = Classroom.objects.get_or_create(
            room_number=room_data['room_number'],
            defaults={
                'room_type': room_data['room_type'],
                'capacity': room_data['capacity'],
                'is_active': True
            }
        )
        if created_new:
            created += 1
            print(f"  ✓ Created: {classroom.room_number} ({classroom.room_type}, Cap: {classroom.capacity})")
    
    print(f"\n✅ Total Classrooms: {Classroom.objects.count()} ({created} new)")

def create_lecturers():
    """Create 50+ lecturers from Faculty of Applied Sciences"""
    print("\n👨‍🏫 Creating Lecturers...")
    created = 0
    faculty = "Faculty of Applied Sciences"
    
    for i, name in enumerate(LECTURER_NAMES, 1):
        # Generate email from name
        email_name = name.lower().replace("dr. ", "").replace("prof. ", "").replace(" ", ".")
        email = f"{email_name}@std.uwu.ac.lk"
        
        # Create user
        user, user_created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': name,
                'role': 'lecturer',
                'first_name': name.split()[1] if len(name.split()) > 1 else name,
                'last_name': name.split()[-1],
                'is_active': True
            }
        )
        
        # Set password to Tharsu@123
        user.set_password('Tharsu@123')
        user.save()
        
        # Create lecturer profile
        profile, profile_created = LecturerProfile.objects.get_or_create(
            user=user,
            defaults={
                'department': faculty,
                'faculty': faculty,
                'availability': generate_random_availability()
            }
        )
        
        if profile_created:
            created += 1
            avail_count = sum(1 for v in profile.availability.values() if v)
            print(f"  ✓ Created: {name} ({avail_count}/15 slots available)")
    
    print(f"\n✅ Total Lecturers: {LecturerProfile.objects.count()} ({created} new)")

def create_students():
    """Create 300+ students across CST, SCT, IIT, MRT courses"""
    print("\n👨‍🎓 Creating Students...")
    created = 0
    
    # Get all courses with these codes
    courses = {}
    for code in COURSE_CODES:
        try:
            course = Course.objects.get(code=code)
            courses[code] = course
        except Course.DoesNotExist:
            print(f"  ⚠️  Course {code} not found in database!")
    
    if not courses:
        print("  ❌ No valid courses found! Please create CST, SCT, IIT, MRT courses first.")
        return
    
    # Generate 300+ students (75+ per course)
    students_per_course = 80
    student_counter = 1
    
    for course_code, course in courses.items():
        for i in range(students_per_course):
            # Generate random name
            first_name = random.choice(FIRST_NAMES)
            last_name = random.choice(LAST_NAMES)
            
            # Generate student ID (e.g., cst12345)
            student_id = f"{course_code.lower()}{student_counter:05d}"
            
            # Generate email
            email = f"{student_id}@std.uwu.ac.lk"
            
            # Random year (1-4) and semester (1-2)
            year = random.randint(1, 4)
            semester = random.randint(1, 2)
            
            # Create user
            user, user_created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': f"{first_name} {last_name} ({student_id})",  # Make username unique
                    'role': 'student',
                    'first_name': first_name,
                    'last_name': last_name,
                    'is_active': True
                }
            )
            
            # Set password to Tharsu@123
            user.set_password('Tharsu@123')
            user.save()
            
            # Create student profile
            profile, profile_created = StudentProfile.objects.get_or_create(
                user=user,
                defaults={
                    'course': course,
                    'year': year,
                    'semester': semester
                }
            )
            
            if profile_created:
                created += 1
                if created % 50 == 0:  # Print progress every 50 students
                    print(f"  ✓ Created {created} students...")
            
            student_counter += 1
    
    print(f"\n✅ Total Students: {StudentProfile.objects.count()} ({created} new)")
    
    # Show distribution
    print("\n  📊 Student Distribution:")
    for code in COURSE_CODES:
        count = StudentProfile.objects.filter(course__code=code).count()
        print(f"    • {code}: {count} students")


def assign_subjects_to_lecturers():
    """Assign all subjects to lecturers evenly"""
    print("\n📖 Assigning Subjects to Lecturers...")
    
    subjects = list(Subject.objects.all())
    lecturers = list(User.objects.filter(role='lecturer'))
    
    if not subjects:
        print("  ⚠️  No subjects found in database!")
        return
    
    if not lecturers:
        print("  ⚠️  No lecturers found!")
        return
    
    # Shuffle for random distribution
    random.shuffle(lecturers)
    
    assignments = 0
    subjects_per_lecturer = {}
    
    # Distribute subjects evenly
    for i, subject in enumerate(subjects):
        lecturer = lecturers[i % len(lecturers)]
        
        # Assign subject to lecturer
        subject.lecturer = lecturer
        subject.save()
        
        # Track assignments
        if lecturer.id not in subjects_per_lecturer:
            subjects_per_lecturer[lecturer.id] = []
        subjects_per_lecturer[lecturer.id].append(subject.code)
        
        assignments += 1
    
    # Print summary
    print(f"\n  ✓ Assigned {assignments} subjects to {len(lecturers)} lecturers")
    print(f"  ✓ Average: {assignments / len(lecturers):.1f} subjects per lecturer")
    
    # Show some examples
    print("\n  Sample Assignments:")
    for lecturer_id, subject_codes in list(subjects_per_lecturer.items())[:5]:
        lecturer = User.objects.get(id=lecturer_id)
        print(f"    • {lecturer.username}: {', '.join(subject_codes[:3])}{'...' if len(subject_codes) > 3 else ''}")

def main():
    """Main seeder function"""
    print("=" * 60)
    print("🌱 DATABASE SEEDER - University Timetable System")
    print("=" * 60)
    
    try:
        with transaction.atomic():
            # Create classrooms
            create_classrooms()
            
            # Create lecturers
            create_lecturers()
            
            # Create students
            create_students()
            
            # Assign subjects
            assign_subjects_to_lecturers()
            
            print("\n" + "=" * 60)
            print("✅ SEEDING COMPLETED SUCCESSFULLY!")
            print("=" * 60)
            print("\n📊 Database Summary:")
            print(f"  • Classrooms: {Classroom.objects.count()}")
            print(f"  • Lecturers: {User.objects.filter(role='lecturer').count()}")
            print(f"  • Students: {User.objects.filter(role='student').count()}")
            print(f"  • Subjects: {Subject.objects.count()}")
            print(f"  • Assigned Subjects: {Subject.objects.exclude(lecturer__isnull=True).count()}")
            print("\n� Login Credentials:")
            print("  • All Users Password: Tharsu@123")
            print("\n📧 Sample Login Emails:")
            print("  • Lecturer: sarah.johnson@std.uwu.ac.lk")
            print("  • Student (CST): cst00001@std.uwu.ac.lk")
            print("  • Student (SCT): sct00001@std.uwu.ac.lk")
            print("  • Student (IIT): iit00001@std.uwu.ac.lk")
            print("  • Student (MRT): mrt00001@std.uwu.ac.lk")
            print("=" * 60)
            
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
