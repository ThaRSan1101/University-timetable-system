from rest_framework import serializers
from .models import TimetableSlot
from academics.serializers import SubjectSerializer, ClassroomSerializer

class TimetableSlotSerializer(serializers.ModelSerializer):
    subject_details = SubjectSerializer(source='subject', read_only=True)
    classroom_details = ClassroomSerializer(source='classroom', read_only=True)
    
    class Meta:
        model = TimetableSlot
        fields = '__all__'
