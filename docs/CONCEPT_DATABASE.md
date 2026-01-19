# 🗄️ Database Design & Schema Documentation

This document explains the **complete database structure** of the University Timetable System, including all tables, relationships, and constraints.

## 📊 **Database Technology**

- **Production**: MySQL 8.0+
- **Development**: MySQL / SQLite (configurable)
- **ORM**: Django ORM (Python)
- **Migrations**: Django Migrations System

---

## 🏗️ **Architecture: Relational Database Model**

We use a **normalized relational schema** with Foreign Key constraints to maintain data integrity.

### **Key Design Principles**

1. **Normalization**: Eliminate redundancy by separating concerns
2. **Referential Integrity**: Foreign keys enforce relationships
3. **One-to-One & One-to-Many**: Clear relationship patterns
4. **Cascade Rules**:DELETE behavior specified per relationship
5. **Unique Constraints**: Prevent duplicate entries

---

## 📋 **Complete Entity Relationship Diagram (ERD)**

```plaintext
                    +------------------+
                    | User |  (Django Auth Extended)
                    | ------------------ |
                    | id (PK) |
                    | email (UNIQUE) |
                    | username |
                    | password (hash) |
                    | role (ENUM) |
                    | is_active |
                    +------------------+
                            |
           +----------------+----------------+
           |  |
   +-----------------+              +------------------+
   | LecturerProfile |  | StudentProfile |
   | ----------------- |  | ------------------ |
   | id (PK) |  | id (PK) |
   | user_id (FK) |  | user_id (FK) |
   | faculty |  | course_id (FK) |
   | department |  | year |
   | phone_number |  | semester |
   | address |  | phone_number |
   | date_of_birth |  | address |
   | profile_picture |  | date_of_birth |
   | availability |  | profile_picture |
   +-----------------+              +------------------+
           |  |
           |  |
           | +------------------+ |
           |  | Course |  |
           |  | ------------------ |  |
           |  | id (PK) |<----+
           |  | name |
           |  | code (UNIQUE) |
           |  | faculty |
           |  | is_active |
           |        +------------------+
           |  |
           |  |
           |        +------------------+
           |  | Subject |
           +------->| ------------------ |
                    | id (PK) |
                    | name |
                    | code (UNIQUE) |
                    | course_id (FK) |
                    | lecturer_id (FK) |
                    | semester (1/2) |
                    | weekly_hours |
                    | room_type |
                    +------------------+
                            |
                            |
           +----------------+----------------+
           |  |
   +-----------------+              +------------------+
   | TimetableSlot |  | Assessment |
   | ----------------- |  | ------------------ |
   | id (PK) |  | id (PK) |
   | subject_id (FK) |  | title |
   | classroom_id |  | assessment_type |
   | day (ENUM) |  | subject_id (FK) |
   | start_time |  | lecturer_id (FK) |
   | end_time |  | due_date |
   | is_locked |  | description |
   +-----------------+              | status |
           |                        +------------------+
           |
   +-----------------+
   | Classroom |
   | ----------------- |
   | id (PK) |
   | room_number |
   | room_type (ENUM) |
   | capacity |
   | is_active |
   +-----------------+

   +-------------------+              +-------------------+
   | SystemSettings |  | TimetableStatus |
   | ------------------- |  | ------------------- |
   | id (PK=1) Singleton | id (PK=1) Singleton
   | current_semester |  | is_published |
   | academic_year |  | last_updated |
   | is_timetable_pub |              +-------------------+
   | updated_at |
   +-------------------+
```

---

## 📑 **Detailed Table Definitions**

### **1. User (Extended Django Auth)**

**Location**: `users/models.py`

| Column | Type | Constraints | Description |
| -------- | ------ | ------------- | ------------- |
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `email` | VARCHAR(254) | UNIQUE, NOT NULL | Login email |
| `username` | VARCHAR(150) | NOT NULL | Display name |
| `password` | VARCHAR(128) | NOT NULL | Bcrypt hashed password |
| `role` | VARCHAR(10) | ENUM('admin', 'lecturer', 'student') | User type |
| `first_name` | VARCHAR(150) | NULLABLE | First name |
| `last_name` | VARCHAR(150) | NULLABLE | Last name |
| `is_active` | BOOLEAN | DEFAULT TRUE | Account status |
| `is_staff` | BOOLEAN | DEFAULT FALSE | Django admin access |
| `date_joined` | DATETIME | AUTO_NOW_ADD | Registration timestamp |

**Indexed Fields**: `email` (unique index)  
**Django Auth Fields**: Includes all standard Django User fields (e.g., `last_login`, `is_superuser`)

---

### **2. LecturerProfile**

**Location**: `users/models.py`

| Column | Type | Constraints | Description |
| -------- | ------ | ------------- | ------------- |
| `id` | INT | PRIMARY KEY | Profile ID |
| `user_id` | INT | FOREIGN KEY → User, UNIQUE | One-to-One relationship |
| `faculty` | VARCHAR(100) | NOT NULL | Faculty name |
| `department` | VARCHAR(100) | NOT NULL | Department name |
| `phone_number` | VARCHAR(15) | NULLABLE | Contact number |
| `address` | TEXT | NULLABLE | Residential address |
| `date_of_birth` | DATE | NULLABLE | Birth date |
| `profile_picture` | VARCHAR(100) | NULLABLE | Image file path |
| `availability` | JSON | DEFAULT {} | Free time slots (future use) |

**Cascade Rule**: ON DELETE CASCADE (if User deleted, profile deleted)

---

### **3. StudentProfile**

**Location**: `users/models.py`

| Column | Type | Constraints | Description |
| -------- | ------ | ------------- | ------------- |
| `id` | INT | PRIMARY KEY | Profile ID |
| `user_id` | INT | FOREIGN KEY → User, UNIQUE | One-to-One relationship |
| `course_id` | INT | FOREIGN KEY → Course, NULLABLE | Enrolled course |
| `year` | INT | DEFAULT 1 | Year level (1-4) |
| `semester` | INT | DEFAULT 1 | Current semester (1-2) |
| `phone_number` | VARCHAR(15) | NULLABLE | Contact number |
| `address` | TEXT | NULLABLE | Residential address |
| `date_of_birth` | DATE | NULLABLE | Birth date |
| `profile_picture` | VARCHAR(100) | NULLABLE | Image file path |

**Cascade Rule**:

- User: ON DELETE CASCADE
- Course: ON DELETE SET_NULL (if course deleted, student remains but course_id = NULL)

---

### **4. Course**

**Location**: `academics/models.py`

| Column | Type | Constraints | Description |
| -------- | ------ | ------------- | ------------- |
| `id` | INT | PRIMARY KEY | Course ID |
| `name` | VARCHAR(100) | NOT NULL | Full course name |
| `code` | VARCHAR(20) | UNIQUE, NOT NULL | Short code (e.g., "CST") |
| `faculty` | VARCHAR(100) | DEFAULT 'General' | Faculty/Department |
| `is_active` | BOOLEAN | DEFAULT TRUE | Active status |

**Example Data**:

```sql
INSERT INTO Course (name, code, faculty) VALUES 
('Computer Science and Technology', 'CST', 'Engineering'),
('Industrial Information Technology', 'IIT', 'Engineering');
```

---

### **5. Subject**

**Location**: `academics/models.py`

| Column | Type | Constraints | Description |
| -------- | ------ | ------------- | ------------- |
| `id` | INT | PRIMARY KEY | Subject ID |
| `name` | VARCHAR(100) | NOT NULL | Subject name |
| `code` | VARCHAR(20) | UNIQUE, NOT NULL | Code (e.g., "CST101") |
| `course_id` | INT | FOREIGN KEY → Course | Belongs to course |
| `lecturer_id` | INT | FOREIGN KEY → User, NULLABLE | Assigned lecturer |
| `semester` | INT | ENUM(1, 2) | Semester offered |
| `weekly_hours` | INT | DEFAULT 3 | Hours per week |
| `room_type` | VARCHAR(20) | ENUM('Lecture Hall', 'Computer Lab') | Preferred room type |

**Cascade Rules**:

- Course: ON DELETE CASCADE
- Lecturer: ON DELETE SET_NULL

**⚠️ Important Notes**:

- `code` format: `{CourseCode}{Year}{SequentialNumber}` (e.g., `CST101` = CS, Year 1, Subject 01)
- Year is **extracted from code**, not stored separately
- `room_type` determines scheduling to appropriate classroom

---

### **6. Classroom**

**Location**: `academics/models.py`

| Column | Type | Constraints | Description |
| -------- | ------ | ------------- | ------------- |
| `id` | INT | PRIMARY KEY | Classroom ID |
| `room_number` | VARCHAR(20) | UNIQUE, NOT NULL | Room identifier |
| `room_type` | VARCHAR(20) | ENUM('Lecture Hall', 'Computer Lab') | Room category |
| `capacity` | INT | DEFAULT 30 | Max students |
| `is_active` | BOOLEAN | DEFAULT TRUE | Availability status |

**Business Rules**:

- Only `is_active=TRUE` rooms used in scheduling
- `room_type` must match `Subject.room_type` for assignment

---

### **7. TimetableSlot**

**Location**: `timetable/models.py`

| Column | Type | Constraints | Description |
| -------- | ------ | ------------- | ------------- |
| `id` | INT | PRIMARY KEY | Slot ID |
| `subject_id` | INT | FOREIGN KEY → Subject | Scheduled subject |
| `classroom_id` | INT | FOREIGN KEY → Classroom | Assigned room |
| `day` | VARCHAR(10) | ENUM('Monday', 'Tuesday', ..., 'Friday') | Day of week |
| `start_time` | TIME | NOT NULL | Lesson start (e.g., 09:00) |
| `end_time` | TIME | NOT NULL | Lesson end (e.g., 10:00) |
| `is_locked` | BOOLEAN | DEFAULT FALSE | Manual edit marker |

**Composite Unique Constraint**:

```sql
UNIQUE (classroom_id, day, start_time)
```

**Purpose**: Prevents double-booking of rooms

**Cascade Rule**: ON DELETE CASCADE (if Subject or Classroom deleted, slot deleted)

**Indexes**:

- `(classroom_id, day, start_time)` - Primary conflict check
- `(subject_id)` - Lecturer conflict lookup
- `(day, start_time)` - Time slot filtering

---

### **8. Assessment**

**Location**: `academics/models.py`

| Column | Type | Constraints | Description |
| -------- | ------ | ------------- | ------------- |
| `id` | INT | PRIMARY KEY | Assessment ID |
| `title` | VARCHAR(200) | NOT NULL | Assessment name |
| `assessment_type` | VARCHAR(50) | ENUM('Assignment', 'Quiz', 'Exam', ...) | Category |
| `subject_id` | INT | FOREIGN KEY → Subject | Related subject |
| `lecturer_id` | INT | FOREIGN KEY → User | Created by |
| `due_date` | DATE | NOT NULL | Submission deadline |
| `description` | TEXT | NULLABLE | Details/instructions |
| `status` | VARCHAR(20) | ENUM('Active', 'Scheduled', ...) | Current state |
| `created_at` | DATETIME | AUTO_NOW_ADD | Creation timestamp |
| `updated_at` | DATETIME | AUTO_NOW | Last modification |

**Cascade Rules**:

- Subject: ON DELETE CASCADE
- Lecturer: ON DELETE CASCADE

**Default Ordering**: `-due_date` (newest first)

---

### **9. SystemSettings (Singleton)**

**Location**: `academics/models.py`

| Column | Type | Constraints | Description |
| -------- | ------ | ------------- | ------------- |
| `id` | INT | PRIMARY KEY = 1 | Always 1 (singleton) |
| `current_semester` | INT | ENUM(1, 2), DEFAULT 1 | Active semester |
| `academic_year` | VARCHAR(20) | DEFAULT '2024/2025' | Current year |
| `updated_at` | DATETIME | AUTO_NOW | Last modification |
| `is_timetable_published` | BOOLEAN | DEFAULT FALSE | Publication status |

**Singleton Pattern**: Only ONE record exists (enforced by `get_or_create(pk=1)`)

**Usage**: Determines which subjects are scheduled during timetable generation

---

### **10. TimetableStatus (Singleton)**

**Location**: `timetable/models.py`

| Column | Type | Constraints | Description |
| -------- | ------ | ------------- | ------------- |
| `id` | INT | PRIMARY KEY = 1 | Always 1 (singleton) |
| `is_published` | BOOLEAN | DEFAULT FALSE | Visibility to users |
| `last_updated` | DATETIME | AUTO_NOW | Generation timestamp |

**Purpose**: Controls whether students/lecturers can view timetable

---

## 🔗 **Relationship Summary**

### **One-to-One**

- User ↔ LecturerProfile
- User ↔ StudentProfile

### **One-to-Many**

- Course → StudentProfile (many students in one course)
- Course → Subject (many subjects in one course)
- User (Lecturer) → Subject (one lecturer teaches many subjects)
- Subject → TimetableSlot (subject appears multiple times in week)
- Subject → Assessment (subject has multiple assessments)
- Classroom → TimetableSlot (room used multiple times)

### **Many-to-Many** (Implicit via Filters)

- Student → Subject (via Course + Year matching)

---

## 🚨 **Data Integrity Rules**

### **Database Constraints**

1. **UNIQUE Constraints**:
   - `User.email`
   - `Course.code`
   - `Subject.code`
   - `Classroom.room_number`
   - `(Classroom, Day, Start_Time)` in TimetableSlot

2. **Foreign Key Constraints**:
   - All `_id` columns enforce referential integrity
   - Cascade delete rules prevent orphaned records

3. **Check Constraints** (Application Logic):
   - `year` ∈ {1, 2, 3, 4}
   - `semester` ∈ {1, 2}
   - `weekly_hours` > 0
   - `capacity` > 0
   - `start_time` < `end_time`

---

## 📂 **Example Queries**

### **Get All Slots for a Specific Lecturer**

```sql
SELECT ts.id, s.name as subject, c.room_number, ts.day, ts.start_time
FROM timetable_slot ts
JOIN subject s ON ts.subject_id = s.id
JOIN classroom c ON ts.classroom_id = c.id
WHERE s.lecturer_id = 5
ORDER BY 
  FIELD(ts.day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'),
  ts.start_time;
```

### **Find Room Conflicts**

```sql
SELECT classroom_id, day, start_time, COUNT(*) as num_classes
FROM timetable_slot
GROUP BY classroom_id, day, start_time
HAVING COUNT(*) > 1;
```

### **Get Student Timetable**

```python
# Django ORM
student = request.user.student_profile
year_level = student.year
course = student.course

slots = TimetableSlot.objects.filter(
    subject__course=course,
    subject__code__contains=f"{course.code}{year_level}"
).select_related('subject', 'classroom')
```

---

## 🎯 **Design Decisions Explained**

### **Why Separate User & Profile Tables?**

- Django best practice for extending auth system
- Allows common user logic (login, permissions) without duplicating
- Easier to add new role types in future

### **Why No `year` Field in Subject?**

- Year is encoded in `code` (e.g., `CST1`01)
- Reduces redundancy
- Subject code follows naming convention naturally

### **Why `is_locked` Field?**

- Tracks manual edits by admins
- Allows differentiation between auto-generated and human-modified slots
- **Current**: Ignored during regeneration (deleted anyway)

### **Why Singleton for Settings?**

- Only one "current" semester at a time
- Prevents duplicate configuration rows
- Easier to access (`SystemSettings.get_settings()`)

---

## 🔧 **Migration Management**

### **Create New Migration**

```bash
python manage.py makemigrations
```

### **View SQL**

```bash
python manage.py sqlmigrate <app_name> <migration_number>
```

### **Apply Migrations**

```bash
python manage.py migrate
```

### **Reset Database** (⚠️ Destructive)

```bash
python manage.py flush  # Clears all data, keeps tables
```

---

## 📚 **Summary**

**Total Tables**: 10 core + Django system tables  
**Total Relationships**: 12 Foreign Keys  
**Unique Constraints**: 5  
**Singleton Models**: 2  

**Database Normalization**: 3rd Normal Form (3NF)  
**Referential Integrity**: Enforced via Foreign Keys  
**Data Validation**: Django model validators + DB constraints  

The schema is designed for **scalability**, **data integrity**, and **query performance** while maintaining clean separation of concerns across the academic domain.
