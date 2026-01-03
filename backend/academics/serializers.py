from rest_framework import serializers
from .models import Course, Subject, Classroom, Assessment

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class ClassroomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classroom
        fields = '__all__'

class SubjectSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.name', read_only=True)
    lecturer_name = serializers.CharField(source='lecturer.username', read_only=True)
    
    class Meta:
        model = Subject
        fields = '__all__'

class AssessmentSerializer(serializers.ModelSerializer):
    subject_details = serializers.SerializerMethodField()
    lecturer_name = serializers.CharField(source='lecturer.username', read_only=True)
    
    class Meta:
        model = Assessment
        fields = ['id', 'title', 'assessment_type', 'subject', 'subject_details', 
                  'lecturer', 'lecturer_name', 'due_date', 'description', 'status', 
                  'created_at', 'updated_at']
        read_only_fields = ['lecturer', 'created_at', 'updated_at']
    
    def get_subject_details(self, obj):
        return {
            'id': obj.subject.id,
            'code': obj.subject.code,
            'name': obj.subject.name,
            'course_name': obj.subject.course.name,
            'course_code': obj.subject.course.code,
            'semester': obj.subject.semester,
        }
