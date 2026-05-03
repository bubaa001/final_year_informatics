from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """Custom User Admin for the extended User model"""
    list_display = ('username', 'email', 'role', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('role', 'is_staff', 'is_active')
    
    # Extend the default fieldsets with profile fields
    fieldsets = list(UserAdmin.fieldsets)
    fieldsets.append(('Profile Info', {
        'fields': ('role', 'bio', 'avatar', 'xp_points', 'learning_streak')
    }))
    
    add_fieldsets = list(UserAdmin.add_fieldsets)
    add_fieldsets.append(('Profile Info', {
        'fields': ('role', 'bio')
    }))
    
    search_fields = ('username', 'email')
    ordering = ('-date_joined',)
