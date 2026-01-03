from rest_framework import viewsets, permissions, status, serializers
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from django.contrib.auth import get_user_model
from .models import LecturerProfile, StudentProfile
from .serializers import UserSerializer, LecturerProfileSerializer, StudentProfileSerializer
from django.core.mail import send_mail
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT serializer that includes user data in login response
    SECURITY: This prevents frontend from decoding JWT
    """
    
    def validate(self, attrs):
        # Sanitize email input (User model uses email as USERNAME_FIELD)
        if 'email' in attrs:
            attrs['email'] = attrs['email'].strip().lower()
        
        # Validate credentials
        # Check active status first
        email = attrs.get(User.USERNAME_FIELD) or attrs.get('email')
        if email:
            user = User.objects.filter(email=email).first()
            if user and not user.is_active:
                raise serializers.ValidationError(
                    'Your account is inactive. Please contact the admin branch.'
                )

        try:
            data = super().validate(attrs)
        except Exception as e:
            # If we already caught inactive, it raised above. If here, it's invalid creds
            raise serializers.ValidationError(
                'Invalid email or password. Please check your credentials and try again.'
            )
        
        # Add user data to response
        # Backend is the source of truth for user identity
        user_data = UserSerializer(self.user).data
        data['user'] = user_data
        
        # Add role for frontend routing
        data['role'] = self.user.role
        
        # Add profile status
        if self.user.role == 'student':
            data['has_profile'] = hasattr(self.user, 'student_profile')
            if data['has_profile']:
                data['course'] = self.user.student_profile.course.name if self.user.student_profile.course else None
                data['year'] = self.user.student_profile.year
        elif self.user.role == 'lecturer':
            data['has_profile'] = hasattr(self.user, 'lecturer_profile')
            if data['has_profile']:
                data['department'] = self.user.lecturer_profile.department
        
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom login endpoint that returns tokens + user data
    """
    serializer_class = CustomTokenObtainPairSerializer


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_current_user(request):
    """
    Get current authenticated user
    SECURITY: 
    - Validates JWT token automatically (via IsAuthenticated)
    - Returns user data from database (source of truth)
    - Frontend cannot forge or manipulate this
    
    Endpoint: GET /api/auth/me/
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        """
        SECURITY: Role-based permissions
        - Anyone can register (create)
        - Only authenticated users can view/update their own data
        - Only admins can view all users
        """
        if self.action == 'create':
            # Allow public registration
            return [permissions.AllowAny()]
        elif self.action in ['list', 'destroy']:
            # Only admins can list all users or delete
            return [permissions.IsAdminUser()]
        elif self.action in ['retrieve', 'update', 'partial_update']:
            # Users can only access their own data
            return [permissions.IsAuthenticated()]
        return super().get_permissions()

    def get_queryset(self):
        """
        SECURITY: Users can only see their own data (unless admin)
        """
        user = self.request.user
        if user.is_staff:
            return User.objects.all()
        return User.objects.filter(id=user.id)

    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def create_lecturer(self, request):
        """
        Admin-only endpoint to create lecturer accounts
        SECURITY: Only admins can create lecturers
        """
        from academics.models import Subject

        data = request.data
        email = data.get('email')

        if User.objects.filter(email=email).exists():
            return Response({"error": "User with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        # Create User
        # Parse Name
        full_name = data.get('name', '').strip()
        if ' ' in full_name:
            first_name, last_name = full_name.rsplit(' ', 1)
        else:
            first_name = full_name or "Lecturer"
            last_name = "User" # Default if no name provided

        username = email.split('@')[0] if email else data.get('username')
        user_data = {
            'username': username,
            'email': email,
            'password': data.get('password', 'Temppassword@123'),
            'first_name': first_name,
            'last_name': last_name,
            'role': 'lecturer'
        }
        serializer = UserSerializer(data=user_data)
        if serializer.is_valid():
            user = serializer.save()
            # Create Profile
            LecturerProfile.objects.create(
                user=user,
                faculty=data.get('faculty'),
                department=data.get('department'),
                availability=data.get('availability', {})
            )
            
            # Assign Subjects
            subjects = data.get('subjects', []) 
            if subjects:
                # Support IDs or Codes or Names
                # We'll try to match by ID first (safe for new frontend)
                found_subs = Subject.objects.filter(id__in=subjects)
                if not found_subs.exists():
                     # Fallback to names or codes if strings sent
                     found_subs = Subject.objects.filter(code__in=subjects) | Subject.objects.filter(name__in=subjects)
                
                for sub in found_subs:
                    sub.lecturer = user
                    sub.save()

            # Send Email (Mock)
            print(f"Sending password to {user.email}: tempPassword123")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        """
        SECURITY: Force 'student' role for public registration
        Only admins can create users with other roles
        Also creates StudentProfile for student registrations
        """
        # Extract profile data before saving user
        course_id = self.request.data.get('course')
        year = self.request.data.get('year')
        
        if not self.request.user.is_staff:
            # Public registration - always student
            user = serializer.save(role='student')
            
            # Update the automatically created StudentProfile (from signals)
            # instead of trying to create a new one (which causes IntegrityError)
            from academics.models import Course
            course = None
            if course_id:
                try:
                    course = Course.objects.get(id=course_id)
                except Course.DoesNotExist:
                    pass
            
            # Get the profile created by signal and update it
            profile, created = StudentProfile.objects.get_or_create(user=user)
            profile.course = course
            profile.year = year if year else 1
            profile.save()
        else:
            # Admin creating user
            serializer.save()


class LogoutView(viewsets.ViewSet):
    """
    Logout endpoint that blacklists refresh token
    SECURITY: Prevents token reuse after logout
    """
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'])
    def logout(self, request):
        try:
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'status': 'success'}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class LecturerProfileViewSet(viewsets.ModelViewSet):
    queryset = LecturerProfile.objects.all()
    serializer_class = LecturerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        SECURITY: Lecturers can only see their own profile
        Admins can see all profiles
        """
        user = self.request.user
        if user.is_staff:
            return LecturerProfile.objects.all()
        return LecturerProfile.objects.filter(user=user)


class StudentProfileViewSet(viewsets.ModelViewSet):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        SECURITY: Students can only see their own profile
        Admins can see all profiles
        """
        user = self.request.user
        if user.is_staff:
            return StudentProfile.objects.all()
        return StudentProfile.objects.filter(user=user)
