# University Semester Timetable Generation & Scheduling System

A complete web application for generating and managing university timetables.

## Features

- **Admin**: Manage lecturers, courses, subjects, classrooms. Generate conflict-free timetables automatically.
- **Lecturer**: View personal timetable.
- **Student**: View class timetable.
- **Auto-Generation**: Algorithm handles conflicts, lunch breaks, and priorities.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS
- **Backend**: Django REST Framework
- **Database**: SQLite (Default) / MySQL (Configurable)
- **Auth**: JWT

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js & npm

### Backend Setup

1. Navigate to `backend` folder:

   ```bash
   cd backend
   ```

2. Create virtual environment (if not exists):

   ```bash
   python -m venv venv
   ```

3. Activate virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

4. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

   *(Note: `requirements.txt` needs to be generated, see below)*

5. Run migrations:

   ```bash
   python manage.py migrate
   ```

6. Seed initial data (Admin, etc.):

   ```bash
   python seed_data.py
   ```

7. Run server:

   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to `frontend` folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run development server:

   ```bash
   npm run dev
   ```

### Default Credentials

- **Admin**: `admin@university.com` / `admin123`
- **Lecturer**: `lecturer@university.com` / `lecturer123`
  - `timetable/`: Generation Logic & Views
- `frontend/`: React project
  - `src/pages/`: Dashboard views
  - `src/components/`: Reusable UI
