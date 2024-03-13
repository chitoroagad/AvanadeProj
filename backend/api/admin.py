from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

from .models import Chat, Tag, UserProfile

User = get_user_model()
# Register your models here.


class UserProfileAdmin(UserAdmin):
    ordering = ["email"]
    list_display = ["email", "name", "is_admin", "is_superuser"]
    search_fields = ["email", "name"]
    list_filter = ["is_admin", "is_superuser"]


admin.site.register(UserProfile, UserProfileAdmin)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ["name"]
    search_fields = ["name"]


@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    list_display = ["title", "author", "created_at"]
    search_fields = ["title", "prompt", "response"]
    list_filter = ["created_at", "tags"]
    list_select_related = ["author"]

    def get_queryset(self, request):
        # Optimizing queryset to reduce the number of queries
        queryset = super().get_queryset(request)
        return queryset.select_related("author").prefetch_related("tags")
