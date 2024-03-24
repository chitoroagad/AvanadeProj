import io

from api.views import *
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.urls import reverse
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient


class TestViews(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="password123"
        )
        self.token = Token(obj=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")

    def test_login(self):
        url = "/login/"
        data = {"email": "test@example.com", "password": "password123"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.data.status, 200)
        self.assertTrue("token" in response.data)
        self.assertTrue("user" in response.data)

    def test_sign_up(self):
        url = "/sign_up/"
        data = {"email": "newuser@example.com", "password": "newpassword123"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.data.status, 200)
        self.assertTrue("token" in response.data)
        self.assertTrue("user" in response.data)

    def test_reload_chat(self):
        url = "/reload_chat/"
        data = {"prompt": "Test prompt", "tasks": ["task1", "task2"]}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.data.status, 201)
        self.assertTrue("chat" in response.data)
        self.assertTrue("tasks" in response.data)

    def test_new_chat(self):
        url = "/new_chat/"
        data = {"prompt": "Test prompt"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.data.status, 201)
        self.assertTrue("chat" in response.data)
        self.assertTrue("tasks" in response.data)


    def test_upload_pdf(self):
        url = '/upload_pdf/'
        # Create a sample PDF file
        pdf_content = b'%PDF-1.4\n%âãÏÓ\n1 0 obj\n<</Type/Catalog/Pages 2 0 R>>\nendobj\n2 0 obj\n<</Type/Pages/Kids[3 0 R]/Count 1>>\nendobj\n3 0 obj\n<</Type/Page/Parent 2 0 R/Resources<</Font<</F1 4 0 R>>/ProcSet[/PDF/Text]/ExtGState<</GS1 6 0 R>>>>/Contents 5 0 R/Group<</Type/Group/S/Transparency/CS/DeviceRGB>>/Tabs/S/StructParents 0>>\nendobj\n4 0 obj\n<</Type/Font/Subtype/Type1/BaseFont/Helvetica/Encoding/WinAnsiEncoding>>\nendobj\n5 0 obj\n<</Filter/FlateDecode/Length 71>>stream\nxœc```b``c``P``````‹``````Jœ%†H†Wïÿ§°\x0c\x11#°³bŸ\nendstream\nendobj\n6 0 obj\n<</Type/ExtGState/ca 1>>\nendobj\nxref\n0 7\n0000000000 65535 f \n0000000015 00000 n \n0000000074 00000 n \n0000000122 00000 n \n0000000175 00000 n \n0000000314 00000 n \n0000000365 00000 n \ntrailer\n<</Size 7/Root 1 0 R>>\nstartxref\n453\n%%EOF\n'
        pdf_file = SimpleUploadedFile('test.pdf', pdf_content, content_type='application/pdf')
        data = {'file': pdf_file}
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.data.status_code, 200)

    def test_get_chat(self):
        # Assuming there's at least one chat created by the user
        chat = Chat.objects.create(author=self.user, prompt='Test Prompt', response='Test Response')
        url = f'/get_chat/{chat.id}/'
        response = self.client.get(url)
        self.assertEqual(response.data.status, 200)

    def test_list_chats(self):
        # Assuming there are chats created by the user
        Chat.objects.create(author=self.user, prompt='Test Prompt 1', response='Test Response 1')
        Chat.objects.create(author=self.user, prompt='Test Prompt 2', response='Test Response 2')
        url = '/list_chats/'
        response = self.client.get(url)
        self.assertEqual(response.data.status, 200)
        self.assertEqual(len(response.data['chats']), 2)

    def test_delete_chat(self):
        # Assuming there's at least one chat created by the user
        chat = Chat.objects.create(author=self.user, prompt='Test Prompt', response='Test Response')
        url = f'/delete_chat/{chat.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.data.status, 204)

    def test_get_prompt_from_file(self):
        url = '/get_prompt_from_file/'
        file_content = b'Test content'
        file = SimpleUploadedFile('test.txt', file_content, content_type='text/plain')
        data = {'file': file}
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.data.status, 200)
        self.assertIn('file', response.data)
        self.assertEqual(response.data['file']['type'], 'text/plain')

    def test_check_token(self):
        url = '/check_token/'
        response = self.client.get(url)
        self.assertEqual(response.data.status, 200)
        self.assertIn('username', response.data)
        self.assertEqual(response.data['username'], 'testuser')

