from django.db import models
from academics.models import Subject, Classroom

class TimetableSlot(models.Model):
    DAYS_OF_WEEK = (
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
    )
    
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE)
    day = models.CharField(max_length=10, choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()
    
    class Meta:
        unique_together = ('classroom', 'day', 'start_time') # Room can't be double booked
        # Also lecturer can't be double booked, but that's a validation rule, not easily unique_together since lecturer is on Subject.

    def __str__(self):
        return f"{self.day} {self.start_time}-{self.end_time}: {self.subject.name} in {self.classroom.room_number}"
