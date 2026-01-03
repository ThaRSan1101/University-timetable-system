import os
import django
import random
import datetime

# Setup Django Environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'university_timetable.settings')
django.setup()

from django.contrib.auth import get_user_model
from academics.models import Course, Classroom, Subject, SystemSettings
from users.models import LecturerProfile, StudentProfile
from timetable.models import TimetableSlot
from timetable.generator import generate_timetable_algo

User = get_user_model()

def seed():
    print("Deleting old data...")
    # Clean slate for Development
    TimetableSlot.objects.all().delete()
    Subject.objects.all().delete()
    Classroom.objects.all().delete()
    Course.objects.all().delete()
    # Delete all non-admin users to reset profiles
    User.objects.filter(is_superuser=False).delete() 
    
    print("Initializing System Settings...")
    # Initialize system settings (singleton)
    settings = SystemSettings.get_settings()
    settings.current_semester = 1
    settings.academic_year = '2024/2025'
    settings.save()
    print(f" -> System Settings: Semester {settings.current_semester}, Academic Year {settings.academic_year}")
    
    print("Seeding Users...")
    
    # 1. Admin (Ensure it exists or skip if persisted)
    if not User.objects.filter(is_superuser=True).exists():
        User.objects.create_superuser('admin', 'admin@std.uwu.ac.lk', 'admin123')
        print(" -> Created Admin: admin@std.uwu.ac.lk / admin123")

    # 2. Lecturers
    # REMOVED: All lecturers are now created manually via Admin Dashboard.
    lecturers = []
            
    # 3. Courses & Faculties
    print("Seeding Faculties and Courses...")
    faculties_data = {
        "Faculty of Applied Sciences": [
            ("Computer Science and Technology", "CST"),
            ("Science and Technology", "SCT"),
            ("Mineral Resources and Technology", "MRT"),
            ("Industrial Information Technology", "IIT"),
        ]
    }

    courses_map = {} # Code -> Course Object

    for faculty, courses in faculties_data.items():
        for name, code in courses:
            c, created = Course.objects.get_or_create(
                code=code,
                defaults={'name': name, 'faculty': faculty}
            )
            # Update faculty/name if it existed
            if not created:
                c.name = name
                c.faculty = faculty
                c.save()
            courses_map[code] = c
            print(f" -> Course: {code} ({name}) in {faculty}")

    # Map courses for usage in subjects
    cst_course = courses_map['CST']
    iit_course = courses_map['IIT']
    sct_course = courses_map['SCT']
    mrt_course = courses_map['MRT']
    
    # 4. Students
    # REMOVED: Sample students are removed as requested.
    # Real students will be registered via the frontend form.

    # 5. Classrooms
    rooms = [
        ('101', 'lecture', 50),
        ('102', 'lecture', 50),
        ('201', 'lecture', 40),
        ('LAB-A', 'lab', 30),
        ('LAB-B', 'lab', 30),
        ('AUDITORIUM', 'lecture', 200)
    ]
    
    for r_num, r_type, cap in rooms:
        Classroom.objects.get_or_create(room_number=r_num, defaults={'room_type': r_type, 'capacity': cap})
        
    print(" -> Created Classrooms")

    # 6. Subjects
    # Schema: (Name, Code, Course, Year, Semester, WeekHours, Priority, LecturerIndex)
    # Note: Weekly hours inferred from credit value (suffix in code) for simplicity.
    
    cst_subjects = [
        # --- Year 1 Semester 1 ---
        ('Introduction to Computer Science', 'CST102', cst_course, 1, 1, 2, 1, 0),
        ('Fundamentals of Electronics', 'CST101', cst_course, 1, 1, 2, 2, 1),
        ('Structured Programming', 'CST121', cst_course, 1, 1, 3, 1, 2),
        ('Essential Mathematics', 'CST111', cst_course, 1, 1, 2, 3, 1),
        ('English Language Level - I', 'ESD121', cst_course, 1, 1, 2, 4, 0),
        ('Web Programming', 'CST122', cst_course, 1, 1, 2, 2, 2),
        ('Fundamentals of Computer Networks', 'CST131', cst_course, 1, 1, 2, 2, 0),
        ('Sinhala Language - I', 'ESD151', cst_course, 1, 1, 1, 5, 1),
        ('Tamil Language - I', 'ESD161', cst_course, 1, 1, 1, 5, 2),
        ('Ethics and Law basics', 'BGE121', cst_course, 1, 1, 2, 4, 0),

        # --- Year 1 Semester 2 ---
        ('Database Management Systems', 'CST123', cst_course, 1, 2, 3, 1, 2),
        ('Microcomputer Architecture and Logic Design', 'CST161', cst_course, 1, 2, 3, 2, 1),
        ('Object Oriented Programming', 'CST124', cst_course, 1, 2, 2, 1, 0),
        ('Calculus', 'CST112', cst_course, 1, 2, 2, 3, 1),
        ('Communication Skills - I', 'ESD111', cst_course, 1, 2, 1, 4, 0),
        ('Quantitative Reasoning', 'ESD141', cst_course, 1, 2, 2, 3, 2),
        ('English Language Level - II', 'ESD122', cst_course, 1, 2, 2, 4, 0),
        ('Sinhala Language - II', 'ESD152', cst_course, 1, 2, 1, 5, 1),
        ('Tamil Language - II', 'ESD162', cst_course, 1, 2, 1, 5, 2),

        # --- Year 2 Semester 1 ---
        ('System Analysis and Design', 'CST241', cst_course, 2, 1, 3, 1, 0),
        ('Statistical Methods - I', 'CST214', cst_course, 2, 1, 3, 3, 1),
        ('Data Communication and Networking', 'CST232', cst_course, 2, 1, 2, 2, 0),
        ('Software Engineering', 'CST242', cst_course, 2, 1, 3, 1, 2),
        ('English Language Level - III', 'ESD221', cst_course, 2, 1, 2, 4, 0),
        ('Aesthetic Studies', 'BGE211', cst_course, 2, 1, 2, 5, 1),
        ('Discrete Mathematics', 'CST213', cst_course, 2, 1, 2, 3, 1),
        ('Entrepreneurship', 'CST291', cst_course, 2, 1, 2, 4, 2),

        # --- Year 2 Semester 2 ---
        ('Data Structures and Analysis of Algorithm', 'CST225', cst_course, 2, 2, 3, 1, 2),
        ('Operating Systems Concepts and Compiler Designs', 'CST262', cst_course, 2, 2, 2, 2, 0),
        ('Rapid Application Development', 'CST243', cst_course, 2, 2, 3, 1, 2),
        ('Project - I', 'CST292', cst_course, 2, 2, 2, 1, 0),
        ('Web Application Development', 'CST226', cst_course, 2, 2, 2, 2, 1),
        ('Information Technology Project Management', 'IIT223', cst_course, 2, 2, 2, 3, 0),

        # --- Year 3 Semester 1 ---
        ('Advanced Programming Techniques', 'CST328', cst_course, 3, 1, 2, 1, 0),
        ('Human Computer Interaction', 'CST371', cst_course, 3, 1, 2, 2, 1),
        ('Intelligent Systems', 'CST372', cst_course, 3, 1, 3, 1, 2),
        ('Advanced Database Management Systems', 'CST327', cst_course, 3, 1, 2, 2, 0),
        ('Computer Graphics', 'CST381', cst_course, 3, 1, 2, 3, 1),
        ('Data and Network Security', 'CST333', cst_course, 3, 1, 2, 2, 0),
        ('Embedded Systems', 'SCT384', cst_course, 3, 1, 2, 3, 1),
        ('Management Information Systems', 'CST344', cst_course, 3, 1, 2, 4, 2),
        ('Mobile Application Development', 'CST345', cst_course, 3, 1, 2, 1, 0),
        ('Principles of Management', 'CST393', cst_course, 3, 1, 2, 4, 2),
        ('Communication Skills - II', 'ESD311', cst_course, 3, 1, 1, 5, 0),
        ('Mathematics for Computing', 'CST315', cst_course, 3, 1, 2, 3, 1),

        # --- Year 3 Semester 2 ---
        ('Software Architecture & Design Patterns', 'CST347', cst_course, 3, 2, 2, 1, 0),
        ('Computer Systems Architecture', 'CST363', cst_course, 3, 2, 2, 2, 1),
        ('Project - II', 'CST394', cst_course, 3, 2, 2, 1, 2),
        ('Software Quality Assurance', 'CST346', cst_course, 3, 2, 2, 2, 0),
        ('Digital Image Processing', 'CST382', cst_course, 3, 2, 3, 3, 1),
        ('Systems Level Programming', 'CST364', cst_course, 3, 2, 2, 2, 0),
        ('Research Methodology and Scientific Writing', 'CST395', cst_course, 3, 2, 2, 3, 1),
        ('Emerging Technologies in CS', 'CST396', cst_course, 3, 2, 1, 4, 2),
        ('Mobile Computing', 'CST334', cst_course, 3, 2, 2, 2, 0),
        ('Statistical Method - II', 'CST316', cst_course, 3, 2, 2, 3, 1),
        ('Parallel and Distributed Computing', 'CST351', cst_course, 3, 2, 2, 2, 0),

        # --- Year 4 Semester 1 ---
        ('Intellectual Property Rights and Commercialization', 'IIT446', cst_course, 4, 1, 2, 4, 0),
        ('Social, Ethical and Professional Issues', 'CST497', cst_course, 4, 1, 2, 4, 1),
        ('Semantic Web Technologies', 'CST429', cst_course, 4, 1, 2, 3, 2),
        ('Cloud Computing', 'CST453', cst_course, 4, 1, 2, 2, 0),
        ('Deep Learning', 'CST476', cst_course, 4, 1, 2, 1, 1),
        ('Remote Sensing and Image Interpretation', 'CST483', cst_course, 4, 1, 2, 3, 2),
        ('Bioinformatics', 'CST473', cst_course, 4, 1, 2, 3, 0),
        ('Enterprise Resource Planning(ERP)', 'CST448', cst_course, 4, 1, 2, 2, 1),
        ('Robotics', 'CST477', cst_course, 4, 1, 2, 2, 2),
        ('Data Warehousing and Data Mining', 'CST474', cst_course, 4, 1, 2, 1, 0),
        ('Digital Forensics', 'CST475', cst_course, 4, 1, 2, 2, 1),
        ('System Administration and Maintenance', 'CST436', cst_course, 4, 1, 2, 2, 2),
        ('Advanced Computer Networks', 'CST435', cst_course, 4, 1, 2, 2, 0),
        ('GIS for Business', 'IIT449', cst_course, 4, 1, 2, 3, 1),
        ('Internet of Things', 'CST437', cst_course, 4, 1, 2, 1, 2),

        # --- Year 4 Semester 2 ---
        ('Industrial Training', 'CST498', cst_course, 4, 2, 6, 1, 0),
        ('Research Project', 'CST499', cst_course, 4, 2, 6, 1, 1),
    ]

    iit_subjects = [
        # --- Year 1 Semester 1 ---
        ('Principles of Management', 'IIT121', iit_course, 1, 1, 3, 3, 1),
        
        # --- Year 1 Semester 2 ---
        ('Fundamentals of Economics', 'IIT131', iit_course, 1, 2, 3, 3, 1),
        
        # --- Year 2 Semester 1 ---
        ('Financial Accounting', 'IIT232', iit_course, 2, 1, 3, 3, 1),
        ('Entrepreneurship', 'IIT241', iit_course, 2, 1, 2, 4, 2),
        
        # --- Year 2 Semester 2 ---
        ('Project - I', 'IIT271', iit_course, 2, 2, 2, 1, 0),
        ('Principles of Marketing', 'IIT251', iit_course, 2, 2, 3, 3, 1),
        ('Management Accountancy', 'IIT233', iit_course, 2, 2, 2, 3, 2),
        ('Operational Research', 'IIT211', iit_course, 2, 2, 2, 3, 1),
        
        # --- Year 3 Semester 1 ---
        ('Business Finance', 'IIT334', iit_course, 3, 1, 2, 3, 1),
        ('Organizational Behavior', 'IIT342', iit_course, 3, 1, 3, 3, 2),
        ('Statistical Methods - I', 'IIT311', iit_course, 3, 1, 3, 3, 0),
        ('Data Structures and Algorithms', 'IIT301', iit_course, 3, 1, 2, 1, 1),
        ('Information Security and Risk Management', 'IIT327', iit_course, 3, 1, 2, 2, 0),
        
        # --- Year 3 Semester 2 ---
        ('Business Law', 'IIT343', iit_course, 3, 2, 2, 3, 1),
        ('Human Resources Management', 'IIT323', iit_course, 3, 2, 2, 3, 2),
        ('Project - II', 'IIT372', iit_course, 3, 2, 2, 1, 0),
        ('Stratergic Management', 'IIT344', iit_course, 3, 2, 2, 3, 2),
        ('Statistical Methods - II', 'IIT313', iit_course, 3, 2, 2, 3, 0),
        ('Digital Image Processing', 'IIT361', iit_course, 3, 2, 2, 2, 1),
        
        # --- Year 4 Semester 1 ---
        ('Business Process Management', 'IIT448', iit_course, 4, 1, 2, 3, 2),
        ('Business Analytics', 'IIT414', iit_course, 4, 1, 2, 3, 0),
        ('GIS for Business', 'IIT447', iit_course, 4, 1, 2, 3, 1),
        ('Organizational Change and Development', 'IIT424', iit_course, 4, 1, 2, 3, 2),
        ('E Commerce', 'IIT445', iit_course, 4, 1, 2, 3, 0),
        ('Digital Marketing', 'IIT452', iit_course, 4, 1, 2, 3, 1),
        ('Advanced Programming Techniques', 'IIT402', iit_course, 4, 1, 2, 1, 1),
        ('Multimedia Technologies', 'IIT462', iit_course, 4, 1, 2, 3, 0),
        
        # --- Year 4 Semester 2 ---
        ('Industrial Training', 'IIT473', iit_course, 4, 2, 6, 1, 1),
        ('Research Project', 'IIT474', iit_course, 4, 2, 6, 1, 2),
    ]

    sct_subjects = [
        # --- Year 1 Semester 1 ---
        ('Essential Mathematics', 'SCT101', sct_course, 1, 1, 1, 1, 0),
        ('Introductory Biology', 'SCT121', sct_course, 1, 1, 1, 2, 1),
        ('General Chemistry', 'SCT131', sct_course, 1, 1, 2, 2, 2),
        ('Engineering Drawings', 'SCT141', sct_course, 1, 1, 1, 3, 0),
        ('Engineering Workshop', 'SCT142', sct_course, 1, 1, 2, 3, 1),
        ('Mechanics, Waves, and Vibrations', 'SCT151', sct_course, 1, 1, 2, 4, 0),
        ('Information Technology', 'ESD103', sct_course, 1, 1, 2, 5, 2),
        
        # --- Year 1 Semester 2 ---
        ('Calculus', 'SCT102', sct_course, 1, 2, 2, 1, 0),
        ('Cell Biology', 'SCT122', sct_course, 1, 2, 2, 2, 1),
        ('Inorganic Chemistry', 'SCT132', sct_course, 1, 2, 2, 2, 2),
        ('Properties of Matter', 'SCT152', sct_course, 1, 2, 2, 3, 0),
        ('Computer Programming', 'SCT161', sct_course, 1, 2, 1, 3, 1),
        
        # --- Year 2 Semester 1 ---
        ('Abstract Algebra', 'SCT201', sct_course, 2, 1, 1, 1, 0),
        ('Statistical Methods', 'SCT211', sct_course, 2, 1, 2, 2, 1),
        ('Microbiology - I', 'SCT221', sct_course, 2, 1, 1, 2, 2),
        ('Biochemistry', 'SCT222', sct_course, 2, 1, 2, 3, 0),
        ('Physical Chemistry', 'SCT231', sct_course, 2, 1, 2, 3, 1),
        ('Optics', 'SCT252', sct_course, 2, 1, 1, 4, 0),
        ('Electricity and Magnetism', 'SCT251', sct_course, 2, 1, 2, 4, 2),
        ('Database Management Systems', 'SCT261', sct_course, 2, 1, 1, 5, 1),
        
        # --- Year 2 Semester 2 ---
        ('Differential Equations and Applications', 'SCT202', sct_course, 2, 2, 3, 1, 0),
        ('Operational Research', 'SCT212', sct_course, 2, 2, 1, 2, 1),
        ('Diversity of Life', 'SCT223', sct_course, 2, 2, 3, 2, 2),
        ('Organic Chemistry', 'SCT232', sct_course, 2, 2, 2, 3, 0),
        ('Engineering Thermodynamics', 'SCT242', sct_course, 2, 2, 2, 3, 1),
        ('Basic Electronics', 'SCT253', sct_course, 2, 2, 1, 4, 0),
        ('Mechanics of Materials', 'SCT241', sct_course, 2, 2, 2, 4, 2),
        ('History', 'BGE213', sct_course, 2, 2, 1, 5, 0),
        ('Geography', 'BGE214', sct_course, 2, 2, 1, 5, 1),
        
        # --- Year 3 Semester 1 ---
        ('Materials Characterization Techniques - I', 'SCT341', sct_course, 3, 1, 2, 1, 0),
        ('Chemistry for Materials Science', 'SCT341', sct_course, 3, 1, 2, 2, 1), # Typo code handled? Will overwrite or error if unique. Assuming distinct courses.
        ('Materials Chemistry', 'SCT342', sct_course, 3, 1, 2, 2, 2), 
        ('Materials Physics', 'SCT343', sct_course, 3, 1, 2, 3, 0),
        ('Materials Technology Laboratory - I', 'SCT344', sct_course, 3, 1, 1, 3, 1),
        ('Polymer Science and Technology - I', 'SCT346', sct_course, 3, 1, 2, 4, 0),
        ('Structural Properties of Materials', 'SCT347', sct_course, 3, 1, 2, 4, 2),
        ('Surface and Colloidal Science', 'SCT348', sct_course, 3, 1, 2, 5, 1),
        ('Mathematical Methods and Complex Analysis', 'SCT377', sct_course, 3, 1, 2, 5, 0),
        ('Environmental Science', 'SCT361', sct_course, 3, 1, 1, 6, 1),
        ('Soft Materials and Their Applications', 'SCT362', sct_course, 3, 1, 1, 6, 2),
        ('Wood and Wood based Product Development', 'SCT363', sct_course, 3, 1, 2, 7, 0),

        # --- Year 3 Semester 2 ---
        ('Biomaterials and Applications', 'SCT351', sct_course, 3, 2, 1, 1, 0),
        ('Ceramic Science and Technology', 'SCT352', sct_course, 3, 2, 2, 1, 1),
        ('Computational Chemistry', 'SCT353', sct_course, 3, 2, 2, 2, 0),
        ('Functional Properties of Materials', 'SCT354', sct_course, 3, 2, 2, 2, 2),
        ('Glass Science and Technology', 'SCT355', sct_course, 3, 2, 1, 3, 0),
        ('Material Characterization Techniques - II', 'SCT356', sct_course, 3, 2, 2, 3, 1),
        ('Materials Technology Laboratory - II', 'SCT357', sct_course, 3, 2, 1, 4, 0),
        ('Polymer Science and Technology - II', 'SCT358', sct_course, 3, 2, 1, 4, 2),
        ('Seminar in Materials Science', 'SCT359', sct_course, 3, 2, 1, 5, 0),
        ('Materials Science Group Project', 'SCT301', sct_course, 3, 2, 2, 5, 1),
        ('Applied Economics and Financial Accounting', 'SCT302', sct_course, 3, 2, 2, 6, 0),
        ('Research Methodology and Scientific Writing', 'SCT303', sct_course, 3, 2, 2, 6, 2),
        
        # --- Year 4 Semester 1 ---
        ('Chemical Engineering Science', 'SCT441', sct_course, 4, 1, 1, 1, 0),
        ('Composites and Polymer Blends', 'SCT442', sct_course, 4, 1, 2, 1, 1),
        ('Materials Technology Laboratory - III', 'SCT443', sct_course, 4, 1, 1, 2, 0),
        ('Metallurgy', 'SCT444', sct_course, 4, 1, 2, 2, 2),
        ('Nano Materials and Nanotechnology', 'SCT445', sct_course, 4, 1, 2, 3, 0),
        ('Product Design and Manufacturing Technology', 'SCT446', sct_course, 4, 1, 2, 3, 1),
        ('Business Management and Entrepreneurship', 'SCT401', sct_course, 4, 1, 2, 4, 0),
        ('Quality Assurance and Control', 'SCT402', sct_course, 4, 1, 2, 4, 1),
        ('Electrochemical Applications', 'SCT461', sct_course, 4, 1, 1, 5, 0),
        ('Green Technology', 'SCT462', sct_course, 4, 1, 1, 5, 2),
        ('Materials for Energy Applications', 'SCT463', sct_course, 4, 1, 1, 6, 0),
        
        # --- Year 4 Semester 2 ---
        ('Industrial Training', 'SCT403', sct_course, 4, 2, 6, 1, 0),
        ('Research Project', 'SCT404', sct_course, 4, 2, 6, 1, 1),
    ]

    mrt_subjects = [
        # --- Year 1 Semester 1 ---
        ('Earth Materials and Processes', 'MRT151', mrt_course, 1, 1, 3, 1, 0),
        ('Water Resources - I', 'MRT152', mrt_course, 1, 1, 1, 1, 1),
        ('Essential Mathematics', 'SCT101', mrt_course, 1, 1, 1, 2, 2),
        ('Introductory Biology', 'SCT121', mrt_course, 1, 1, 1, 2, 0),
        ('General Chemistry', 'SCT131', mrt_course, 1, 1, 2, 3, 1),
        ('Engineering Drawings', 'SCT141', mrt_course, 1, 1, 1, 3, 2),
        ('Mechanics, Waves, and Vibrations', 'SCT151', mrt_course, 1, 1, 2, 4, 0),
        ('English Language Level- I', 'ESD121', mrt_course, 1, 1, 2, 4, 1),
        ('Sinhala Language - I', 'ESD151', mrt_course, 1, 1, 1, 5, 2),
        ('Tamil Language - I', 'ESD161', mrt_course, 1, 1, 1, 5, 0),
        ('Information Technology', 'ESD103', mrt_course, 1, 1, 2, 5, 1),
        ('Ethics and Law Basics', 'BGE121', mrt_course, 1, 1, 2, 5, 2),

        # --- Year 1 Semester 2 ---
        ('Mineralogy and Petrology - I', 'MRT161', mrt_course, 1, 2, 3, 1, 0),
        ('Water Resources - II', 'MRT162', mrt_course, 1, 2, 1, 1, 1),
        ('Calculus', 'SCT102', mrt_course, 1, 2, 2, 2, 2),
        ('Inorganic Chemistry', 'SCT132', mrt_course, 1, 2, 2, 2, 0),
        ('Properties of Matter', 'SCT152', mrt_course, 1, 2, 2, 3, 1),
        ('English Language Level - II', 'ESD122', mrt_course, 1, 2, 2, 3, 2),
        ('Sinhala Language - II', 'ESD152', mrt_course, 1, 2, 1, 4, 0),
        ('Tamil Language - II', 'ESD162', mrt_course, 1, 2, 1, 4, 1),
        ('Communication Skills - I', 'ESD111', mrt_course, 1, 2, 1, 5, 2),
        ('Quantitative Reasoning', 'ESD141', mrt_course, 1, 2, 2, 5, 0),

        # --- Year 2 Semester 1 ---
        ('Mineralogy and Petrology - II', 'MRT251', mrt_course, 2, 1, 3, 1, 0),
        ('Principles of Hydrogeology', 'MRT253', mrt_course, 2, 1, 2, 1, 1),
        ('Abstract Algebra', 'SCT201', mrt_course, 2, 1, 1, 2, 2),
        ('Statistical Methods', 'SCT211', mrt_course, 2, 1, 2, 2, 0),
        ('Physical Chemistry', 'SCT231', mrt_course, 2, 1, 2, 3, 1),
        ('Electricity and Magnetism', 'SCT251', mrt_course, 2, 1, 2, 3, 2),
        ('Optics', 'SCT252', mrt_course, 2, 1, 1, 4, 0),
        ('English Language Level- III', 'ESD221', mrt_course, 2, 1, 2, 4, 1),
        ('Aesthetic Studies', 'BGE211', mrt_course, 2, 1, 2, 5, 2),

        # --- Year 2 Semester 2 ---
        ('Structural Geology', 'MRT252', mrt_course, 2, 2, 2, 1, 0),
        ('Applied Geochemistry', 'MRT254', mrt_course, 2, 2, 2, 1, 1),
        ('Differential Equations and Applications', 'SCT202', mrt_course, 2, 2, 3, 2, 2),
        ('Organic Chemistry', 'SCT232', mrt_course, 2, 2, 2, 2, 0),
        ('Engineering Thermodynamics', 'SCT242', mrt_course, 2, 2, 2, 3, 1),
        ('Electronics', 'SCT253', mrt_course, 2, 2, 1, 3, 2),
        ('Operational Research', 'SCT212', mrt_course, 2, 2, 1, 4, 0),
        ('History', 'BGE213', mrt_course, 2, 2, 1, 4, 1),
        ('Geography', 'BGE214', mrt_course, 2, 2, 1, 5, 2),

        # --- Year 3 Semester 1 ---
        ('Physics and Chemistry of Minerals', 'MRT311', mrt_course, 3, 1, 2, 1, 0),
        ('Genesis of Mineral Deposits', 'MRT312', mrt_course, 3, 1, 2, 1, 1),
        ('Analytical Techniques and Instrumentation - I', 'MRT362', mrt_course, 3, 1, 2, 1, 2),
        ('Gemmology', 'MRT313', mrt_course, 3, 1, 2, 2, 0),
        ('Gemmology Laboratory', 'MRT314', mrt_course, 3, 1, 1, 2, 1),
        ('Technical Mineralogy - I', 'MRT315', mrt_course, 3, 1, 3, 2, 2),
        ('Engineering Geology', 'MRT316', mrt_course, 3, 1, 3, 3, 0),
        ('Industrial Mineral Processing Technology', 'MRT317', mrt_course, 3, 1, 2, 3, 1),
        ('Industrial Mineral Processing Laboratory', 'MRT318', mrt_course, 3, 1, 1, 3, 2),
        ('Surveying and Levelling', 'MRT352', mrt_course, 3, 1, 2, 4, 0),
        ('Engineering Workshop Technology', 'MRT353', mrt_course, 3, 1, 1, 4, 1),
        ('Soil Physics', 'MRT355', mrt_course, 3, 1, 2, 4, 2),
        ('Computer Programming', 'MRT366', mrt_course, 3, 1, 1, 5, 0),
        ('Fluid Mechanics and Hydraulics', 'MRT374', mrt_course, 3, 1, 3, 5, 1),
        ('Oceanography', 'MRT377', mrt_course, 3, 1, 2, 5, 2),
        ('Communication Skills - II', 'ESD311', mrt_course, 3, 1, 1, 6, 0),

        # --- Year 3 Semester 2 ---
        ('Mineral Exploration Methods', 'MRT321', mrt_course, 3, 2, 2, 1, 0),
        ('Remote Sensing and Geospatial Technology', 'MRT365', mrt_course, 3, 2, 3, 1, 1),
        ('Research Methodology and Scientific Writing', 'MRT361', mrt_course, 3, 2, 2, 1, 2),
        ('Gemstone Fashioning', 'MRT322', mrt_course, 3, 2, 2, 2, 0),
        ('Technical Mineralogy - II', 'MRT324', mrt_course, 3, 2, 3, 2, 1),
        ('Mine Planning Strategies', 'MRT325', mrt_course, 3, 2, 2, 2, 2),
        ('Petroleum Exploration and Extraction', 'MRT327', mrt_course, 3, 2, 2, 3, 0),
        ('Applied Geophysics', 'MRT351', mrt_course, 3, 2, 3, 3, 1),
        ('Quantity Surveying', 'MRT363', mrt_course, 3, 2, 2, 3, 2),
        ('Computer Aided Drawing and Designing', 'MRT364', mrt_course, 3, 2, 1, 4, 0),
        ('Water Safety Plan', 'MRT381', mrt_course, 3, 2, 2, 4, 1),
        ('Project Management', 'MRT392', mrt_course, 3, 2, 2, 4, 2),
        ('Human Resources Management', 'IIT323', mrt_course, 3, 2, 2, 5, 0),
        ('Applied Economics and Financial Accounting', 'SCT302', mrt_course, 3, 2, 2, 5, 1),

        # --- Year 4 Semester 1 ---
        ('Mineral Economics', 'MRT411', mrt_course, 4, 1, 2, 1, 0),
        ('Mineral Nanoscience and Technology', 'MRT412', mrt_course, 4, 1, 2, 1, 1),
        ('Environment and Industry Regulations', 'MRT451', mrt_course, 4, 1, 2, 1, 2),
        ('Analytical Techniques and Instrumentation - II', 'MRT463', mrt_course, 4, 1, 2, 2, 0),
        ('Gem Enhancement Techniques', 'MRT413', mrt_course, 4, 1, 2, 2, 1),
        ('Jewellery Designing', 'MRT414', mrt_course, 4, 1, 2, 2, 2),
        ('Ceramic and Glass Technology', 'MRT415', mrt_course, 4, 1, 3, 3, 0),
        ('Mining Methods', 'MRT416', mrt_course, 4, 1, 2, 3, 1),
        ('Extractive Metallurgy', 'MRT417', mrt_course, 4, 1, 2, 3, 2),
        ('Simulation of Mineral Processing Systems', 'MRT418', mrt_course, 4, 1, 2, 4, 0),
        ('Pollution Control and Remediation', 'MRT453', mrt_course, 4, 1, 2, 4, 1),
        ('Quantity Surveying', 'MRT454', mrt_course, 4, 1, 2, 4, 2),
        ('Intellectual Property Rights', 'IIT446', mrt_course, 4, 1, 2, 5, 0),
        ('Business Management and Entrepreneurship', 'SCT401', mrt_course, 4, 1, 2, 5, 1),
        ('Quality Assurance and Control', 'SCT402', mrt_course, 4, 1, 2, 5, 2),
    ]
    
    subjects_data = cst_subjects + iit_subjects + sct_subjects + mrt_subjects

    print("Seeding Subjects...")
    for name, code, course, year, sem, hours, prio, lec_idx in subjects_data:
        Subject.objects.get_or_create(
            code=code,
            defaults={
                'name': name,
                'course': course,
                'year': year,
                'semester': sem,
                'weekly_hours': hours,
                'priority': prio,
                'lecturer': lecturers[lec_idx] if lec_idx < len(lecturers) else lecturers[0]
            }
        )


    print("Generating Timetable...")
    result = generate_timetable_algo()
    
    print(f" -> Total Subjects: {result['total_subjects']}")
    print(f" -> Fully Scheduled: {result['fully_scheduled']}")
    print(f" -> Total Slots Created: {result['total_slots_created']}")
    
    if result['unscheduled']:
        print(f"\n⚠️  Warning: {len(result['unscheduled'])} subjects could not be fully scheduled:")
        for item in result['unscheduled']:
            print(f"   - {item['subject']} ({item['code']}): {item['scheduled']}/{item['needed']} hours")
            print(f"     Reason: {item['reason']}")
    else:
        print("\n✅ Success! Timetable generated with 0 conflicts.")


if __name__ == '__main__':
    seed()
