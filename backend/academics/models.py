from django.db import models
from users.models import User

class Course(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    faculty = models.CharField(max_length=100, default='General')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Classroom(models.Model):
    ROOM_TYPES = (
        ('Lecture Hall', 'Lecture Hall'),
        ('Computer Lab', 'Computer Lab'),
    )
    room_number = models.CharField(max_length=20, unique=True)
    room_type = models.CharField(max_length=20, choices=ROOM_TYPES)
    capacity = models.IntegerField(default=30)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.room_number} ({self.room_type})"

class Subject(models.Model):
    ROOM_PREF = (
        ('Lecture Hall', 'Lecture Hall'),
        ('Computer Lab', 'Computer Lab'),
    )
    
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='subjects')
    # Lecturer is now optional
    lecturer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='subjects')
    
    # Year field removed as requested
    
    semester = models.IntegerField(choices=((1, '1'), (2, '2')))
    weekly_hours = models.IntegerField(default=3)
    
    # Replaces priority field
    room_type = models.CharField(max_length=20, choices=ROOM_PREF, default='Lecture Hall') 

    def __str__(self):
        return f"{self.code} - {self.name}"

class SystemSettings(models.Model):
    current_semester = models.IntegerField(choices=((1, 'Semester 1'), (2, 'Semester 2')), default=1, help_text="Currently active semester")
    academic_year = models.CharField(max_length=20, default='2024/2025', help_text="Current academic year (e.g., 2024/2025)")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "System Settings"
        verbose_name_plural = "System Settings"

    def __str__(self):
        return f"Settings ({self.academic_year} - Sem {self.current_semester})"

    @classmethod
    def get_settings(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj
