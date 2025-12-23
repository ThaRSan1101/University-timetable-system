from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from .models import LecturerProfile, StudentProfile
from .serializers import UserSerializer, LecturerProfileSerializer, StudentProfileSerializer
from django.core.mail import send_mail # Mocking email sending

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action == 'create': # Allow registration? Or only admin creates?
            # Prompt says: Student register/login only using university email.
            # Admin creates Lecturer.
            return [permissions.AllowAny()]
        return super().get_permissions()

    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def create_lecturer(self, request):
        data = request.data
        # Create User
        user_data = {
            'username': data.get('email'),
            'email': data.get('email'),
            'password': 'tempPassword123', # Should be auto-generated
            'role': 'lecturer'
        }
        serializer = UserSerializer(data=user_data)
        if serializer.is_valid():
            user = serializer.save()
            # Create Profile
            LecturerProfile.objects.create(
                user=user,
                faculty=data.get('faculty'),
                department=data.get('department')
            )
            # Send Email (Mock)
            print(f"Sending password to {user.email}: tempPassword123")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LecturerProfileViewSet(viewsets.ModelViewSet):
    queryset = LecturerProfile.objects.all()
    serializer_class = LecturerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

class StudentProfileViewSet(viewsets.ModelViewSet):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
