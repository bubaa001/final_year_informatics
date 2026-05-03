# backend/accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User

class UserRegistrationSerializer(serializers.ModelSerializer):
    """Handles user registration"""
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'role')
        extra_kwargs = {
            'email': {'required': True},
            'role': {'required': False},
        }
    
    def validate(self, attrs):
        if attrs.get('password2') and attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2', None)
        if 'role' not in validated_data or not validated_data['role']:
            validated_data['role'] = 'student'
        user = User.objects.create_user(**validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    """Handles user login"""
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        user = authenticate(
            request=self.context.get('request'),
            username=email,
            password=password
        )
        
        if not user:
            raise serializers.ValidationError({'error': 'Invalid email or password'})
        
        if not user.is_active:
            raise serializers.ValidationError({'error': 'Account is disabled'})
        
        attrs['user'] = user
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    """Returns user profile information"""
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'bio', 
                 'avatar', 'xp_points', 'learning_streak', 
                 'date_joined', 'last_login')
        read_only_fields = ('id', 'date_joined', 'last_login')