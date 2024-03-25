from api.models import UserProfile
from api.views import *
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.urls import resolve, reverse
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient, APIRequestFactory, APITestCase

from .models import Folder, Group, Project, Space


class SpaceViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = UserProfile.objects.create_user(
            name="testuser", email="test@example.com", password="testpassword"
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)
        self.group = Group.objects.create(name="Test Group")

    def test_space_list_get(self):
        space = Space.objects.create(
            name="Test Space", owner=self.user, group=self.group
        )
        url = reverse("space-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_space_list_post(self):
        url = reverse("space-list")
        data = {"name": "New Space", "group": self.group.id}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Space.objects.count(), 1)

    def test_space_detail_get(self):
        space = Space.objects.create(
            name="Test Space", owner=self.user, group=self.group
        )
        url = reverse("space-detail", kwargs={"pk": space.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["name"], "Test Space")

    def test_space_detail_put(self):
        space = Space.objects.create(
            name="Test Space", owner=self.user, group=self.group
        )
        url = reverse("space-detail", kwargs={"pk": space.pk})
        data = {"name": "Updated Space"}
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Space.objects.get().name, "Updated Space")

    def test_space_detail_delete(self):
        space = Space.objects.create(
            name="Test Space", owner=self.user, group=self.group
        )
        url = reverse("space-detail", kwargs={"pk": space.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Space.objects.count(), 0)

    def test_folders_list(self):
        space = Space.objects.create(
            name="Test Space", owner=self.user, group=self.group
        )
        Folder.objects.create(name="Test Folder", space=space)
        url = reverse("folder-list", kwargs={"space_id": space.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_folder_detail(self):
        space = Space.objects.create(
            name="Test Space", owner=self.user, group=self.group
        )
        folder = Folder.objects.create(name="Test Folder", space=space)
        url = reverse("folder-detail", kwargs={"pk": folder.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["name"], "Test Folder")

    def test_group_list(self):
        url = reverse("group-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_group_detail(self):
        url = reverse("group-detail", kwargs={"pk": self.group.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["name"], "Test Group")

    def test_add_member(self):
        user = UserProfile.objects.create_user(
            name="newuser", email="new@mail.com", password="newpassword"
        )
        url = reverse("add-member", kwargs={"pk": self.group.pk})
        data = {"user": user.id}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)

    def test_tag_list(self):
        url = reverse("tag-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_tag_detail(self):
        url = reverse("tag-detail", kwargs={"pk": 1})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_project_list_get(self):
        url = reverse("project-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_project_list_post(self):
        url = reverse("project-list")
        data = {"name": "New Project"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Project.objects.count(), 1)

    def test_project_detail_get(self):
        project = Project.objects.create(name="Test Project")
        url = reverse("project-detail", kwargs={"pk": project.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["name"], "Test Project")

    def test_project_detail_put(self):
        project = Project.objects.create(name="Test Project")
        url = reverse("project-detail", kwargs={"pk": project.pk})
        data = {"name": "Updated Project"}
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Project.objects.get().name, "Updated Project")

    def test_project_detail_delete(self):
        project = Project.objects.create(name="Test Project")
        url = reverse("project-detail", kwargs={"pk": project.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Project.objects.count(), 0)
