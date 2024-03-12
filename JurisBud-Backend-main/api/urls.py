from django.urls import path

from . import views

urlpatterns = [
    path("login", views.login),
    path("signup", views.sign_up),
    path("chats", views.list_chats),
    path("chat/<int:pk>", views.get_chat),
    path("chat/create", views.new_chat),
    path("chat/delete/<int:pk>", views.delete_chat),
    path("check_token", views.check_token),
    path("chat/upload_prompt", views.get_prompt_from_file),
]
