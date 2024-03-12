from django.urls import path
from .views import SpaceViewSet, FolderViewSet, GroupViewSet, TagViewSet, ProjectViewSet

# Assuming each viewset has the standard actions: list, create, retrieve, update, partial_update, and destroy

urlpatterns = [
    path('spaces/',
         SpaceViewSet.as_view({'get': 'list', 'post': 'create'}), name='space-list'),
    path('spaces/<int:pk>/', SpaceViewSet.as_view({'get': 'retrieve', 'put': 'update',
         'patch': 'partial_update', 'delete': 'destroy'}), name='space-detail'),

    path('folders/',
         FolderViewSet.as_view({'get': 'list', 'post': 'create'}), name='folder-list'),
    path('folders/<int:pk>/', FolderViewSet.as_view({'get': 'retrieve', 'put': 'update',
         'patch': 'partial_update', 'delete': 'destroy'}), name='folder-detail'),

    path('groups/',
         GroupViewSet.as_view({'get': 'list', 'post': 'create'}), name='group-list'),
    path('groups/<int:pk>/', GroupViewSet.as_view({'get': 'retrieve', 'put': 'update',
         'patch': 'partial_update', 'delete': 'destroy'}), name='group-detail'),

    path(
        'tags/', TagViewSet.as_view({'get': 'list', 'post': 'create'}), name='tag-list'),
    path('tags/<int:pk>/', TagViewSet.as_view({'get': 'retrieve', 'put': 'update',
         'patch': 'partial_update', 'delete': 'destroy'}), name='tag-detail'),

    path('projects/',
         ProjectViewSet.as_view({'get': 'list', 'post': 'create'}), name='project-list'),
    path('projects/<int:pk>/', ProjectViewSet.as_view(
        {'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='project-detail'),
]
