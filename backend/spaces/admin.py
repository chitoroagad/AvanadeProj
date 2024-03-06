from django.contrib import admin
from .models import Tag, Group, Space, Folder, Project


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ["name", "color"]
    search_fields = ["name"]
    list_filter = ["color"]


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ["name"]
    # Uncomment the following line if you wish to enable member listing and searching.
    # filter_horizontal = ['members']


@admin.register(Space)
class SpaceAdmin(admin.ModelAdmin):
    list_display = ["name", "description", "created_at", "group", "owner"]
    search_fields = ["name", "description", "group__name", "owner__name"]
    list_filter = ["created_at", "tags", "group"]
    filter_horizontal = ["tags"]


@admin.register(Folder)
class FolderAdmin(admin.ModelAdmin):
    list_display = ["name", "space", "created_at"]
    search_fields = ["name", "space__name"]
    list_filter = ["created_at", "space"]


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ["name", "folder", "created_at", "due_date", "status", "owner"]
    search_fields = ["name", "folder__name", "status", "owner__name"]
    list_filter = ["created_at", "due_date", "status", "tags"]
    filter_horizontal = ["tags"]
