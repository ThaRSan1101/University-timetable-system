# 🎓 University Timetable System

## 📌 What is this Project?

This is a comprehensive web application designed to **automate the complex process of university scheduling**. It serves as a central platform where administrators can manage resources (lecturers, students, classrooms) and generate conflict-free timetables automatically using an intelligent algorithm.

## 🎯 Why was it created?

Manual timetable scheduling is tedious, time-consuming, and prone to human errors like double-booking rooms or assigning a lecturer to two classes at once.

**This system solves these problems by:**

* **Eliminating Scheduling Conflicts**: Automatically detects and prevents overlaps.
* **Saving Time**: Reduces weeks of planning work to a single click.
* **Optimizing Resources**: Ensures efficient usage of classrooms and labs.
* **Instant Access**: Provides real-time schedules to students and staff via their personalized dashboards.

## 🛠️ Technology Stack

* **Frontend**: React.js 18 + Vite (Fast & Interactive UI)
* **Styling**: Tailwind CSS (Modern, Responsive Design)
* **Backend**: Django 4.2 + Django REST Framework (Robust API)
* **Database**: MySQL 8.0 (Relational Data Management)
* **Authentication**: JWT (Secure JSON Web Tokens)
* **Language**: Python 3.10+ & JavaScript (ES6+)

## 🚀 Key Functionalities

1. **🤖 Smart Auto-Generation**: Uses a greedy heuristic algorithm to schedule classes while respecting constraints (Room capacity, Lecturer availability, etc.).
2. **🔒 Role-Based Access Control (RBAC)**:
    * **Admin**: Full control. Can manage Users, Courses, Subjects, Classrooms, and Generate Timetables.
    * **Lecturer**: Read-only access to their personal teaching schedule and assigned subjects.
    * **Student**: Read-only access to their specific course/year timetable.
3. **⚡ Conflict Resolution**: Hard constraints ensure no room or person is double-booked.
4. **📝 Manual Overrides**: Admins can manually edit and "Lock" specific timetable slots if needed.
5. **📱 Responsive Design**: Works seamlessly on desktops, tablets, and mobile devices.

## ⚙️ How to Set Up & Run

### Prerequisites

* **Python** (3.10 or higher)
* **Node.js** (v18 or higher)
* **MySQL Server** (Running locally)
* **Git**

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/ThaRSan1101/University-timetable-system.git
cd university-timetable-system
```

### 2️⃣ Database Setup

Open your MySQL Client (e.g., Workbench) and run:

```sql
CREATE DATABASE university_timetable CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3️⃣ Backend Setup (Django)

```bash
cd backend

# 1. Create & Activate Virtual Environment
python -m venv .venv
.venv\Scripts\activate   # On Windows
# source .venv/bin/activate  # On Mac/Linux

# 2. Install Dependencies
pip install -r requirements.txt

# 3. Configure Environment Variables
# Create a .env file in the 'backend' folder
# Add the following lines (Update DB_PASSWORD with YOUR MySQL password):
# DB_NAME=university_timetable
# DB_USER=root
# DB_PASSWORD=your_mysql_password
# DB_HOST=localhost
# DB_PORT=3306
# SECRET_KEY=unsafe-secret-key-for-dev

# 4. Initialize Database
python manage.py migrate

# 5. (Optional) Load Sample Data
python seed_data.py

# 6. Start the Server
python manage.py runserver
```

*Backend runs at: `http://localhost:8000`*

### 4️⃣ Frontend Setup (React)

Open a new terminal window:

```bash
cd frontend

# 1. Install Dependencies
npm install

# 2. Start Development Server
npm run dev
```

*Frontend runs at: `http://localhost:5173`*

---

## ⚠️ Important Notes

### 🔑 Default Credentials

(If you ran `python seed_data.py`)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@university.com` | `admin123` |
| **Lecturer** | `lecturer@university.com` | `lecturer123` |
| **Student** | `student@university.com` | `student123` |

### 🛑 Troubleshooting

* **MySQL Errors**: Ensure your MySQL server is running and the password in `backend/.env` is correct.
* **Port In Use**: If port 8000 is taken, Django will fail. Close other python processes or specify a port: `python manage.py runserver 8080`.
* **Missing Modules**: Make sure your virtual environment (`.venv`) is **active** when installing requirements or running Python.

---
Project maintained by ThaRSan1101
