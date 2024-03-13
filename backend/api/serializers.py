from django.contrib.auth import get_user_model, password_validation
from django.core import exceptions
from rest_framework import serializers

from .models import Chat, Tag

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    chats = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Chat.objects.all(), required=False, write_only=True
    )

    class Meta(object):
        model = User
        fields = ["id", "name", "email", "password", "chats"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_password(self, value):
        try:
            password_validation.validate_password(value)
        except exceptions.ValidationError as exc:
            strexc = str(exc)
            if strexc.startswith("['"):
                strexc = strexc[2:-3]
                raise serializers.ValidationError(strexc)
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = super().create(validated_data)
        user.set_password(password)
        user.save()
        return user


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["name"]


class ChatSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, required=False)

    class Meta:
        model = Chat
        fields = ["id", "title", "tags", "prompt", "response", "author"]
        read_only_fields = ["author"]

    def create(self, validated_data):
        tags_data = validated_data.pop("tags", [])
        chat = Chat.objects.create(**validated_data)
        for tag_data in tags_data:
            tag, created = Tag.objects.get_or_create(**tag_data)
            chat.tags.add(tag)
        return chat

    def update(self, instance, validated_data):
        instance.title = validated_data.get("title", instance.title)
        instance.prompt = validated_data.get("prompt", instance.prompt)
        instance.response = validated_data.get("response", instance.response)
        # Handle tags update if necessary
        instance.save()
        return instance
