from django.db import models
from django.contrib.auth.models import User

class Dataset(models.Model):
    file = models.FileField(upload_to='datasets/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    summary = models.JSONField(null=True, blank=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='datasets', null=True)

    def __str__(self):
        return f"Dataset {self.id} - {self.file.name}"

