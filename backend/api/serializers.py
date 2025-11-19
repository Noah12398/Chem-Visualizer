from rest_framework import serializers
from .models import Dataset

class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = ('id','file','uploaded_at','summary')
        read_only_fields = ('uploaded_at','summary')
