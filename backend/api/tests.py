import io

from api.models import UserProfile
from api.views import *
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.urls import resolve, reverse
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient, APIRequestFactory, APITestCase


class TestViews(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.factory = APIRequestFactory()
        self.user = UserProfile.objects.create_user(
            name="testuser", email="test@example.com", password="password123"
        )
        login = self.client.force_authenticate(user=self.user)
        self.token = Token(key="testtoken", user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")

    def test_login(self):
        url = reverse("login")
        data = {"email": "test@example.com", "password": "password123"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertTrue("token" in response.data)
        self.assertTrue("user" in response.data)

    def test_sign_up(self):
        url = reverse("sign_up")
        data = {
            "name": "newuse",
            "email": "newuser@example.com",
            "password": "newpassword123",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertTrue("token" in response.data)
        self.assertTrue("user" in response.data)

    def test_reload_chat(self):
        url = reverse("reload_chat")
        data = {"body": {"prompt": "Test prompt", "tasks": ["task1", "task2"]}}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertTrue("chat" in response.data)
        self.assertTrue("tasks" in response.data)

    def test_new_chat(self):
        url = reverse("new_chat")
        data = {"prompt": "Test prompt"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertTrue("chat" in response.data)
        self.assertTrue("tasks" in response.data)

    def test_upload_pdf(self):
        url = reverse("add_pdf_to_gpt")
        # Create a sample PDF file
        pdf = open("tests/test.pdf", "rb")
        data = {"file": pdf}
        response = self.client.post(url, data, format="multipart")
        self.assertEqual(response.status_code, 200)

    def test_get_chat(self):
        # Assuming there's at least one chat created by the user
        chat = Chat.objects.create(
            author=self.user, prompt="Test Prompt", response="Test Response"
        )
        url = reverse("get_chat", kwargs={"pk": chat.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_list_chats(self):
        # Assuming there are chats created by the user
        Chat.objects.create(
            author=self.user, prompt="Test Prompt 1", response="Test Response 1"
        )
        Chat.objects.create(
            author=self.user, prompt="Test Prompt 2", response="Test Response 2"
        )
        url = reverse("list_chats")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["chats"]), 2)

    def test_delete_chat(self):
        # Assuming there's at least one chat created by the user
        chat = Chat.objects.create(
            author=self.user, prompt="Test Prompt", response="Test Response"
        )
        url = reverse("delete_chat", kwargs={"pk": chat.id})
        data = {"Token": self.token.key}
        response = self.client.delete(url, data, format="json")
        self.assertEqual(response.status_code, 204)

    def test_get_prompt_from_file(self):
        url = reverse("get_prompt_from_file")
        file_content = b"Test content"
        file = SimpleUploadedFile("test.txt", file_content, content_type="text/plain")
        data = {"file": file, "token": self.token.key, "user": self.user}
        response = self.client.post(url, data, format="multipart")
        self.assertEqual(response.status_code, 200)
        self.assertIn("file", response.data)
        self.assertEqual(response.data["file"]["type"], "text/plain")

    def test_check_token(self):
        url = reverse("check_token")
        data = (
            {
                "token": self.token.key,
                "user": self.user.name,
            },
        )

        response = self.client.get(url, data, format="json")
        print(response)
        self.assertEqual(response.status_code, 200)
        self.assertIn("username", response.data)
        self.assertEqual(response.data["username"], "testuser")
