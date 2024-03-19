# Create your views here.

import io

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core import exceptions
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.authentication import (SessionAuthentication,
                                           TokenAuthentication)
from rest_framework.authtoken.models import Token
from rest_framework.decorators import (api_view, authentication_classes,
                                       parser_classes, permission_classes)
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Chat
from .serializers import ChatSerializer, UserSerializer
from .utils import ask_gpt, pdf_to_text, validate_file_type

User = get_user_model()


@api_view(["POST"])
def login(request, format=None):
    data = request.data
    # if not data.get('email') or not data.get('password'):
    #   return Response({"detail": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)
    user = get_object_or_404(User, email=data.get("email"))
    if not user.check_password(data.get("password")):
        raise Http404
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)
    return Response({"token": token.key, "user": serializer.data})


@api_view(["POST"])
def sign_up(request, format=None):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(email=request.data.get("email"))
        token = Token.objects.create(user=user)
        return Response({"token": token.key, "user": serializer.data})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
async def new_chat(request, format=None):
    data = request.data
    print("data>>>", data)

    data["response"] = ask_gpt({"input", data["prompt"]})

    if not data["response"]:
        return Response(
            {"detail": "gpt model not responding"}, status=status.HTTP_400_BAD_REQUEST
        )
    data["title"] = data["prompt"]
    serializer = ChatSerializer(data=data)
    if serializer.is_valid():
        serializer.save(author=request.user)
        return Response({"chat": serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_chat(request, pk, format=None):
    chat = get_object_or_404(Chat, id=pk, author=request.user)
    serializer = ChatSerializer(instance=chat)
    return Response({"chat": serializer.data})


@api_view(["GET"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def list_chats(request, format=None):
    chats = Chat.objects.filter(author=request.user)
    serializer = ChatSerializer(instance=chats, many=True)
    return Response({"chats": serializer.data})


@api_view(["DELETE"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_chat(request, pk, format=None):
    chat = get_object_or_404(Chat, id=pk, author=request.user)
    chat.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["POST"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser])
def get_prompt_from_file(request, format=None):
    file = request.FILES.get("file")
    if not file:
        return Response(
            {"detail": "file is missing"}, status=status.HTTP_400_BAD_REQUEST
        )
    content = file.read()
    try:
        file_type = validate_file_type(content, file.content_type)
    except exceptions.ValidationError:
        return Response(
            {"detail": "file type is not allowed"}, status=status.HTTP_400_BAD_REQUEST
        )
    except Exception:
        return Response(
            {"detail": "file upload failed"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    if file_type == "application/pdf":
        text = pdf_to_text(content)
    else:
        text = content
    return Response({"file": {"type": file_type, "content": text}})


@api_view(["GET"])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def check_token(request, format=None):
    return Response({"message": "success", "username": request.user.name})
