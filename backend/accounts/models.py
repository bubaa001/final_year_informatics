# backend/accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from typing import Any

class User(AbstractUser):
    """Extended User with learning profile"""
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('instructor', 'Instructor'), 
        ('admin', 'Admin'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True)
    xp_points = models.IntegerField(default=0)
    learning_streak = models.IntegerField(default=0)
    last_active = models.DateTimeField(auto_now=True)

    # 🔧 ADD THESE TWO FIELDS BELOW
    # They override the default fields from AbstractUser
    # to prevent the naming conflict with Django's built-in User model
    
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name='custom_user_set',  # 👈 Custom name to avoid conflict
        related_query_name='custom_user',
    )
    
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='custom_user_set',  # 👈 Custom name to avoid conflict
        related_query_name='custom_user',
    )

    def __str__(self):
        return f"{self.username} - {self.get_role_display()}"
    
    class Meta:
        ordering = ['-date_joined']