from django.db import models
from django.conf import settings

class Course(models.Model):
    name = models.CharField(max_length=100) # e.g. Computer Science
    code = models.CharField(max_length=20, unique=True)
    faculty = models.CharField(max_length=100, default='General') # Grouping by Faculty

    def __str__(self):
        return self.name

class Classroom(models.Model):
    ROOM_TYPES = (
        ('lecture', 'Lecture Hall'),
        ('lab', 'Laboratory'),
    )
    room_number = models.CharField(max_length=20, unique=True)
    room_type = models.CharField(max_length=10, choices=ROOM_TYPES)
    capacity = models.IntegerField()

    def __str__(self):
        return f"{self.room_number} ({self.get_room_type_display()})"

class Subject(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='subjects')
    year = models.IntegerField()
    semester = models.IntegerField()
    weekly_hours = models.IntegerField()
    priority = models.IntegerField(default=1) # Higher number = higher priority? Or 1 is high? Let's assume 1 is high.
    lecturer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, limit_choices_to={'role': 'lecturer'})

    def __str__(self):
        return f"{self.name} ({self.course.code} Y{self.year}S{self.semester})"

class SystemSettings(models.Model):
    """
    Singleton model to store system-wide settings like current semester
    """
    current_semester = models.IntegerField(
        choices=[(1, 'Semester 1'), (2, 'Semester 2')], 
        default=1,
        help_text="Currently active semester"
    )
    academic_year = models.CharField(
        max_length=20, 
        default='2024/2025',
        help_text="Current academic year (e.g., 2024/2025)"
    )
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "System Settings"
        verbose_name_plural = "System Settings"
    
    def __str__(self):
        return f"Semester {self.current_semester} - {self.academic_year}"
    
    def save(self, *args, **kwargs):
        # Ensure only one instance exists (singleton pattern)
        self.pk = 1
        super().save(*args, **kwargs)
    
    @classmethod
    def get_settings(cls):
        """Get or create the singleton settings instance"""
        settings, created = cls.objects.get_or_create(pk=1)
        return settings

