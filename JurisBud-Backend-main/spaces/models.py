from api.models import UserProfile
from django.db import models


class Tag(models.Model):
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7, default="#FFFFFF")  # HEX Color


class Group(models.Model):
    name = models.CharField(max_length=100)
    # members = models.ManyToManyField("api.UserProfile", related_name='groups')


class Space(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    tags = models.ManyToManyField(Tag, related_name="spaces")
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="spaces")
    owner = models.ForeignKey(
        "api.UserProfile", on_delete=models.CASCADE, related_name="owned_spaces"
    )

    def add_member(self, user):
        self.group.members.add(user)


class Folder(models.Model):
    name = models.CharField(max_length=100)
    space = models.ForeignKey(Space, on_delete=models.CASCADE, related_name="folders")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Ensure unique folder names within a space
        unique_together = ("name", "space")


class Project(models.Model):
    name = models.CharField(max_length=100)
    folder = models.ForeignKey(
        Folder, on_delete=models.CASCADE, related_name="projects"
    )
    tags = models.ManyToManyField(Tag, related_name="projects")
    created_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField(null=True, blank=True)
    # Consider an Enum for predefined statuses
    status = models.CharField(max_length=100, default="active")
    owner = models.ForeignKey(
        "api.UserProfile", on_delete=models.CASCADE, related_name="owned_projects"
    )

    def is_overdue(self):
        return self.due_date < timezone.now() if self.due_date else False
