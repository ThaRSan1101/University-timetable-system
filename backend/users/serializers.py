from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import LecturerProfile, StudentProfile

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    lecturer_profile = serializers.SerializerMethodField()
    student_profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'password', 'lecturer_profile', 'student_profile']
        extra_kwargs = {'password': {'write_only': True}}

    def get_lecturer_profile(self, obj):
        if hasattr(obj, 'lecturer_profile'):
            return LecturerProfileSerializer(obj.lecturer_profile).data
        return None

    def get_student_profile(self, obj):
        if hasattr(obj, 'student_profile'):
            return StudentProfileSerializer(obj.student_profile).data
        return None

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class BasicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

class LecturerProfileSerializer(serializers.ModelSerializer):
    user = BasicUserSerializer(read_only=True)
    class Meta:
        model = LecturerProfile
        fields = '__all__'

class StudentProfileSerializer(serializers.ModelSerializer):
    user = BasicUserSerializer(read_only=True)
    class Meta:
        model = StudentProfile
        fields = '__all__'
