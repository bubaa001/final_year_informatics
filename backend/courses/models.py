from django.db import models

# Create your models here.
# backend/courses/models.py
from django.db import models
from django.conf import settings  # IMPORTANT: Use this to reference User

class Course(models.Model):
    """
    Main course model
    """
    DIFFICULTY_LEVELS = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    
    # Use settings.AUTH_USER_MODEL instead of directly importing User
    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # This resolves to 'accounts.User'
        on_delete=models.CASCADE,
        related_name='courses_teaching'  # instructor.courses_teaching.all()
    )
    
    difficulty = models.CharField(
        max_length=20, 
        choices=DIFFICULTY_LEVELS,
        default='beginner'
    )
    thumbnail = models.ImageField(upload_to='courses/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=False)
    enrollment_count = models.IntegerField(default=0)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-created_at']


class Module(models.Model):
    """
    Course modules/chapters
    """
    course = models.ForeignKey(
        Course,  # Now Course IS defined!
        on_delete=models.CASCADE,
        related_name='modules'  # course.modules.all()
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.course.title} - {self.title}"
    
    class Meta:
        ordering = ['order']


class Lesson(models.Model):
    """
    Individual lessons within modules
    """
    CONTENT_TYPES = [
        ('video', 'Video'),
        ('text', 'Text'),
        ('quiz', 'Quiz'),
        ('assignment', 'Assignment'),
    ]
    
    module = models.ForeignKey(
        Module,
        on_delete=models.CASCADE,
        related_name='lessons'  # module.lessons.all()
    )
    title = models.CharField(max_length=200)
    content_type = models.CharField(
        max_length=20, 
        choices=CONTENT_TYPES,
        default='text'
    )
    content = models.TextField(blank=True)
    video_url = models.URLField(blank=True, null=True)
    duration_minutes = models.IntegerField(default=0)
    order = models.IntegerField(default=0)
    xp_reward = models.IntegerField(default=10)
    
    def __str__(self):
        return f"{self.module.title} - {self.title}"
    
    class Meta:
        ordering = ['order']


class Enrollment(models.Model):
    """
    Track student enrollments in courses
    """
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='enrollments'  # student.enrollments.all()
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='enrollments'  # course.enrollments.all()
    )
    enrolled_at = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)
    progress_percentage = models.FloatField(default=0)
    last_accessed = models.DateTimeField(auto_now=True)
    
    class Meta:
        # Prevent duplicate enrollments
        unique_together = ['student', 'course']
        ordering = ['-enrolled_at']
    
    def __str__(self):
        return f"{self.student.username} enrolled in {self.course.title}"


class Progress(models.Model):
    """
    Track individual lesson progress
    """
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='lesson_progress'
    )
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name='student_progress'
    )
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    time_spent_minutes = models.IntegerField(default=0)
    score = models.FloatField(null=True, blank=True)
    
    class Meta:
        unique_together = ['student', 'lesson']
    
    def __str__(self):
        return f"{self.student.username} - {self.lesson.title}"


class Discussion(models.Model):
    """
    Course discussion forum
    """
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='discussions'
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='discussions'
    )
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_pinned = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title


class Note(models.Model):
    """
    Student personal notes
    """
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notes'
    )
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name='notes'
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"Note by {self.student.username} on {self.lesson.title}"