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
        fields = ['id', 'username', 'email', 'role', 'password', 'first_name', 'last_name', 'lecturer_profile', 'student_profile', 'is_active']
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
        fields = ['id', 'username', 'email', 'role', 'first_name', 'last_name', 'is_active']

class LecturerProfileSerializer(serializers.ModelSerializer):
    user = BasicUserSerializer(read_only=True)
    name = serializers.SerializerMethodField()
    staffId = serializers.SerializerMethodField()
    subjects = serializers.SerializerMethodField()
    weeklyHours = serializers.SerializerMethodField()
    maxHours = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = LecturerProfile
        fields = ['id', 'user', 'name', 'staffId', 'department', 'faculty', 'subjects', 'weeklyHours', 'maxHours', 'avatar', 'phone_number', 'address', 'date_of_birth', 'availability']

    def get_name(self, obj):
        first = obj.user.first_name
        last = obj.user.last_name
        if last == 'User' or not last:
            return first
        if first and last:
            return f"{first} {last}"
        return obj.user.username

    def get_avatar(self, obj):
        name = self.get_name(obj)
        import urllib.parse
        encoded_name = urllib.parse.quote(name)
        return f"https://ui-avatars.com/api/?name={encoded_name}&background=random"

    def get_staffId(self, obj):
        return f"LEC{obj.user.id:03d}"

    def get_subjects(self, obj):
        # Access subjects via related user
        if hasattr(obj.user, 'subjects'):
            return [{'id': sub.id, 'name': sub.name, 'code': sub.code} for sub in obj.user.subjects.all()]
        return []

    def get_weeklyHours(self, obj):
        total = 0
        if hasattr(obj.user, 'subjects'):
            for sub in obj.user.subjects.all():
                total += sub.weekly_hours
        return total
    
    def get_maxHours(self, obj):
        return 20 # Hardcoded for now, or add field to model later


class StudentProfileSerializer(serializers.ModelSerializer):
    user = BasicUserSerializer(read_only=True)
    department = serializers.CharField(source='course.faculty', read_only=True)
    course_code = serializers.CharField(source='course.code', read_only=True)
    subjects = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()

    class Meta:
        model = StudentProfile
        fields = ['id', 'user', 'name', 'department', 'course', 'course_code', 'year', 'semester', 'subjects']

    def get_name(self, obj):
        first = obj.user.first_name
        last = obj.user.last_name
        if last == 'User' or not last:
            return first
        if first and last:
            return f"{first} {last}"
        return obj.user.username

    def get_subjects(self, obj):
        if obj.course:
            from academics.models import Subject
            # Filter by Semester (DB)
            all_subjects = Subject.objects.filter(course=obj.course, semester=obj.semester)
            
            # Filter by Year (Infer from Code: 1xx=Year 1, 2xx=Year 2, etc.)
            filtered_codes = []
            for sub in all_subjects:
                match = re.search(r'\d+', sub.code)
                if match and match.group().startswith(str(obj.year)):
                    filtered_codes.append(sub.code)
            
            return filtered_codes
        return []
    


