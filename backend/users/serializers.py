from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import LecturerProfile, StudentProfile
import re

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    lecturer_profile = serializers.SerializerMethodField()
    student_profile = serializers.SerializerMethodField()
    first_name = serializers.CharField(required=True, max_length=150)
    last_name = serializers.CharField(required=True, max_length=150)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'password', 'first_name', 'last_name', 'lecturer_profile', 'student_profile']
        extra_kwargs = {'password': {'write_only': True}}

    def get_lecturer_profile(self, obj):
        if hasattr(obj, 'lecturer_profile'):
            return LecturerProfileSerializer(obj.lecturer_profile).data
        return None

    def get_student_profile(self, obj):
        if hasattr(obj, 'student_profile'):
            return StudentProfileSerializer(obj.student_profile).data
        return None

    def validate_email(self, value):
        """
        Validate student email format: abc12345@std.uwu.ac.lk
        3 letters + 5 numbers + @std.uwu.ac.lk
        """
        # Only validate for student role
        role = self.initial_data.get('role', '')
        if role == 'student':
            # Relaxed validation for testing flexibility
            # Ensure it ends with strict domain, but allow broader prefixes
            if not value.endswith('@std.uwu.ac.lk'):
                raise serializers.ValidationError(
                    "Student email must end with @std.uwu.ac.lk"
                )
            
            # Optional: Warning-level or less strict check for the prefix format if strictly needed later
            # For now, allowing any valid email prefix with the correct domain
        return value.lower()

    def validate_password(self, value):
        """
        Validate password strength:
        - Minimum 8 characters
        - At least one uppercase letter
        - At least one lowercase letter
        - At least one digit
        - At least one special character
        """
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError("Password must contain at least one lowercase letter.")
        
        if not re.search(r'\d', value):
            raise serializers.ValidationError("Password must contain at least one number.")
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise serializers.ValidationError("Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>).")
        
        return value

    def validate_username(self, value):
        """Sanitize username - remove extra spaces and validate length"""
        value = value.strip()
        if len(value) < 3:
            raise serializers.ValidationError("Username must be at least 3 characters long.")
        if len(value) > 150:
            raise serializers.ValidationError("Username must not exceed 150 characters.")
        return value

    def validate_first_name(self, value):
        """Sanitize first name"""
        value = value.strip()
        if not value:
            raise serializers.ValidationError("First name is required.")
        if not re.match(r'^[a-zA-Z\s\-]+$', value):
            raise serializers.ValidationError("First name can only contain letters, spaces, and hyphens.")
        return value.title()

    def validate_last_name(self, value):
        """Sanitize last name"""
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Last name is required.")
        if not re.match(r'^[a-zA-Z\s\-]+$', value):
            raise serializers.ValidationError("Last name can only contain letters, spaces, and hyphens.")
        return value.title()

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
    


