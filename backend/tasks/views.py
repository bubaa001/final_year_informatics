from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Task
import json

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def task_list(request):
    if request.method == 'GET':
        tasks = Task.objects.filter(owner=request.user)  # only user’s own tasks
        data = list(tasks.values('id', 'title', 'completed'))
        return Response(data)
    elif request.method == 'POST':
        data = json.loads(request.body)
        task = Task.objects.create(
            title=data['title'],
            owner=request.user
        )
        return Response({'id': task.id, 'title': task.title, 'completed': task.completed}, status=201)