from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Dataset

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

class DatasetSerializer(serializers.ModelSerializer):
    uploaded_by_username = serializers.CharField(source='uploaded_by.username', read_only=True)
    
    class Meta:
        model = Dataset
        fields = ('id', 'file', 'uploaded_at', 'summary', 'uploaded_by_username')
        read_only_fields = ('uploaded_at', 'summary', 'uploaded_by_username')

