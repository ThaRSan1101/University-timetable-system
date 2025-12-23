# University Timetable System - Complete Documentation

## 1. Project Overview

This is a **University Semester Timetable Generation & Scheduling System**. It is a web-based application designed to automatically generate conflict-free timetables for universities.

### **Core Features**

* **Role-Based Access**:
  * **Admin**: Manages everything (Lecturers, Courses, Subjects, Rooms) and generates timetables.
  * **Lecturer**: Views their own teaching schedule.
  * **Student**: Views their class schedule.
* **Auto-Generation Algorithm**: A smart logic that assigns classes to rooms and times while avoiding conflicts (e.g., one professor cannot be in two places at once).
* **Modern Tech Stack**: Built with Django (Python) for the backend and React (JavaScript) for the frontend.

---

## 2. Technical Architecture (How it Works)

The project follows the **MVC (Model-View-Controller)** pattern, split into two separate parts:

### **Backend (The Brain)**

* **Technology**: Django REST Framework (Python).
* **Location**: `backend/` folder.
* **Responsibility**:
  * Talks to the Database (MySQL).
  * Handles Logic (Login, Timetable Algorithm).
  * Provides API Endpoints (e.g., `http://localhost:8000/api/courses/`).

### **Frontend (The Face)**

* **Technology**: React + Vite + Tailwind CSS.
* **Location**: `frontend/` folder.
* **Responsibility**:
  * Shows the beautiful UI to the user.
  * Fetches data from the Backend API.
  * Handles page navigation.

### **Database (The Memory)**

* **Technology**: MySQL (Production) / SQLite (Default Dev).
* **Responsibility**: Stores all users, subjects, and schedules permanently.

---

## 3. Project Structure Explained

Here is what every folder does, so you know where to look.

```text
university-timetable-system/
│
├── backend/                  # DJANGO PROJECT
│   ├── university_timetable/ # Main settings (DB config, installed apps)
│   ├── users/                # Logic for Login, Admin, Lecturers, Students
│   ├── academics/            # Logic for Courses, Subjects, Classrooms
│   ├── timetable/            # Logic for Generating the Schedule
│   ├── manage.py             # Command tool to run the server
│   ├── seed_data.py          # Script to add dummy data quickly
│   └── requirements.txt      # List of Python libraries needed
│
├── frontend/                 # REACT PROJECT
│   ├── src/
│   │   ├── pages/            # The actual screens (Dashboard, Login, etc.)
│   │   ├── components/       # Small parts (Navbar, ProtectedRoute)
│   │   ├── context/          # AuthContext (Handles "Am I logged in?")
│   │   ├── services/         # api.js (Talks to the Backend)
│   │   └── App.jsx           # Main Router (Decides which page to show)
│   ├── index.html            # The main HTML file
│   └── package.json          # List of JavaScript libraries needed
│
└── docs/                     # Documentation (You are here)
```

---

## 4. Setup Guide for Team Members

If your friend wants to run this project on their laptop, send them these instructions.

### **Prerequisites (What they need to install first)**

1. **Python** (v3.10 or newer) - [Download](https://www.python.org/downloads/)
2. **Node.js** (v18 or newer) - [Download](https://nodejs.org/)
3. **MySQL Server** (Optional, but recommended) - Can use XAMPP or MySQL Workbench.
4. **Git** - To clone the repo.

### **Step-by-Step Installation**

#### **Step 1: Get the Code**

```bash
git clone https://github.com/ThaRSan1101/University-timetable-system.git
cd university-timetable-system
```

#### **Step 1.1: Pulling Latest Changes (For Team Members)**

If you already have the project and want to get the latest updates:

```bash
git pull origin main
```

#### **Step 2: Setup Backend**

Open a terminal in the `backend` folder.

```bash
cd backend
python -m venv venv                # Create virtual environment
.\venv\Scripts\activate            # Activate it (Windows)
# source venv/bin/activate         # (Mac/Linux)

pip install -r requirements.txt    # Install dependencies
```

#### **Step 3: Database Setup (MySQL)**

1. Open **MySQL Workbench** or **phpMyAdmin**.
2. Create a new empty database named `university_timetable`.
3. **Create the Environment File**:
    * Duplicate the file `backend/.env.example`.
    * Rename the copy to `backend/.env`.
    * Open `backend/.env` and set your MySQL password:

    ```env
    DB_NAME=university_timetable
    DB_USER=root
    DB_PASSWORD=your_mysql_password  <-- CHANGE THIS
    DB_HOST=localhost
    DB_PORT=3306
    ```

4. Run migrations to create tables:

    ```bash
    python manage.py migrate
    ```

5. Add starter data:

    ```bash
    python seed_data.py
    ```

#### **Step 4: Setup Frontend**

Open a new terminal in the `frontend` folder.

```bash
cd frontend
npm install
```

#### **Step 5: Run Everything**

* **Option A (Easy)**: Double-click `start_all.bat` in the root folder.
* **Option B (Manual)**:
  * Backend: `python manage.py runserver`
  * Frontend: `npm run dev`

---

## 5. Troubleshooting Common Errors

### **Error: "mysqlclient 2.2.1 required" / "Visual C++ required"**

* **Cause**: Installing MySQL drivers on Windows is hard.
* **Solution**: We use `pymysql` instead. It is already configured in `settings.py`. Just ensure you run `pip install -r requirements.txt`.

### **Error: "MySQL shutdown unexpectedly" (XAMPP)**

* **Cause**: Port 3306 is blocked because MySQL Workbench is already running.
* **Solution**: Stop XAMPP. Use MySQL Workbench instead. Update `.env` with Workbench password.

### **Error: "Access denied for user 'root'@'localhost'"**

* **Cause**: Wrong password in `backend/.env`.
* **Solution**: Check your MySQL password. If you don't have one, leave `DB_PASSWORD=` empty.

---

## 6. How to Customize & Modify

So you want to change the design or logic? Here is where to go.

### **"I want to change the Colors / UI Design"**

* **Where**: `frontend/src/index.css`
* **How**: We use **Tailwind CSS**.
  * Change `--color-primary` in `index.css` to change the main blue color.
  * Go to any page (e.g., `Login.jsx`) and change classes like `bg-blue-500` to `bg-red-500`.

### **"I want to change the Timetable Algorithm"**

* **Where**: `backend/timetable/generator.py`
* **How**: This file contains the logic.
  * Look for the loop `for hour in range(start_hour, end_hour):`.
  * You can change the start time (8 AM) or end time (5 PM) here.
  * You can add new rules (e.g., "No classes on Friday afternoon").

### **"I want to add a new Page"**

1. Create the file in `frontend/src/pages/` (e.g., `MyNewPage.jsx`).
2. Add a route in `frontend/src/App.jsx`.
3. Add a link in the Navbar inside `frontend/src/App.jsx` (Layout component).

### **"I want to add a new Database Field"**

1. Go to `backend/academics/models.py` (or relevant app).
2. Add the field: `description = models.TextField(blank=True)`.
3. Run: `python manage.py makemigrations`
4. Run: `python manage.py migrate`

---

## 7. Default Credentials

Use these to log in immediately after seeding data.

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@university.com` | `admin123` |
| **Lecturer** | `lecturer@university.com` | `lecturer123` |
| **Student** | `student@university.com` | `student123` |
