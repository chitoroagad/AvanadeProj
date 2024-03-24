from django.urls import path
from . import views

urlpatterns = [
    # Space URLs
    path('/', views.space_list, name='space-list'),
    path('/<int:pk>/', views.space_detail, name='space-detail'),

    # Folder URLs
    path('/<int:space_id>/folders/',
         views.folder_list, name='folder_list'),
    path('folders/<int:pk>/', views.folder_detail, name='folder-detail'),

    # Group URLs
    path('/groups', views.group_list, name='group-list'),
    path('groups/<int:pk>/', views.group_detail, name='group-detail'),
    path('groups/<int:pk>/add_member/', views.add_member, name='add-member'),

    # Tag URLs
    path('tags/', views.tag_list, name='tag-list'),
    path('tags/<int:pk>/', views.tag_detail, name='tag-detail'),

    # Project URLs
    path('projects/', views.project_list, name='project-list'),
    path('projects/<int:pk>/', views.project_detail, name='project-detail'),
    # Add any other project-specific paths here, if necessary
]
