# Database Design & Relationships Explained

This document explains how we store data and how different tables connect to each other (The "Schema").

## **The Big Picture**

We use a **Relational Database** (MySQL). This means data is stored in tables that are linked by "Foreign Keys" (IDs).

## **1. Users & Profiles**

We separate the "Login Info" from the "Academic Info".

* **`User` Table**: Stores `username`, `password`, `email`, `role`.
* **`LecturerProfile` Table**:
  * Links to `User` (One-to-One).
  * Stores `faculty`, `department`.
* **`StudentProfile` Table**:
  * Links to `User` (One-to-One).
  * Links to `Course` (Foreign Key) -> *A student belongs to ONE course.*
  * Stores `year`, `semester`.

## **2. Academic Structure**

* **`Course` Table**: e.g., "Computer Science", "Business".
* **`Subject` Table**: e.g., "Python Programming".
  * Links to `Course` -> *Python belongs to CS.*
  * Links to `Lecturer` -> *Dr. Smith teaches Python.*
  * Stores `weekly_hours`, `priority`.
* **`Classroom` Table**: e.g., "Room 101".
  * Stores `capacity`, `type` (Lab vs Lecture).

## **3. The Timetable (The Centerpiece)**

The **`TimetableSlot`** table is where everything comes together. It represents **ONE block** on the schedule.

| ID | Subject_ID | Room_ID | Day | Start_Time | End_Time |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 10 (Python) | 5 (R101) | Mon | 09:00 | 10:00 |

**Constraints (Rules enforced by DB):**

* **Unique Constraint**: `(Room_ID, Day, Start_Time)` must be unique.
  * *Meaning*: The database literally prevents you from saving two classes in Room 101 at Monday 9 AM. It will throw an error.

---

## **Why this design?**

1. **Normalization**: We don't repeat data. If Dr. Smith changes his name, we update it in the `User` table once, and it updates everywhere.
2. **Scalability**: We can easily add more years, semesters, or departments without changing the structure.
3. **Integrity**: The Foreign Keys ensure we can't delete a Course if there are Students assigned to it (unless we explicitly say so).
