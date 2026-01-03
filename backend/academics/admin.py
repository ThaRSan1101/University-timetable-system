from django.contrib import admin
from .models import Course, Subject, Classroom, SystemSettings, Assessment

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'faculty', 'is_active']
    search_fields = ['code', 'name']

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'course', 'lecturer', 'semester']
    list_filter = ['course', 'semester']
    search_fields = ['code', 'name']

@admin.register(Classroom)
class ClassroomAdmin(admin.ModelAdmin):
    list_display = ['room_number', 'room_type', 'capacity', 'is_active']
    list_filter = ['room_type', 'is_active']

@admin.register(SystemSettings)
class SystemSettingsAdmin(admin.ModelAdmin):
    list_display = ['academic_year', 'current_semester', 'updated_at']

@admin.register(Assessment)
class AssessmentAdmin(admin.ModelAdmin):
    list_display = ['title', 'assessment_type', 'subject', 'lecturer', 'due_date', 'status']
    list_filter = ['assessment_type', 'status', 'due_date']
    search_fields = ['title', 'subject__code', 'subject__name', 'lecturer__username']
    date_hierarchy = 'due_date'
