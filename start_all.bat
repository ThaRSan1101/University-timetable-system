@echo off
start cmd /k "cd backend && venv\Scripts\activate && python manage.py runserver"
start cmd /k "cd frontend && npm run dev"
echo Project started!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
pause
