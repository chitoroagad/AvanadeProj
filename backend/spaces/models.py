from django.db import models


class Tag(models.Model):
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7, default='#FFFFFF')  # HEX Color


class Group(models.Model):
    name = models.CharField(max_length=100)
    # members = models.ManyToManyField("api.UserProfile", related_name='groups')


class Space(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    tags = models.ManyToManyField(Tag, related_name='spaces', blank=True)
    group = models.ForeignKey(
        Group, on_delete=models.CASCADE, related_name='spaces', null=True, blank=True)
    owner = models.ForeignKey('api.UserProfile', on_delete=models.CASCADE,
                              related_name='owned_spaces', null=True, blank=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # Save the Space instance first
        is_new = self._state.adding
        super(Space, self).save(*args, **kwargs)

        # If this is a new Space instance, create the folders
        if is_new:
            predefined_folders = ['Team Projects',
                                  'Collaborations', 'Personal Projects']
            for folder_name in predefined_folders:
                Folder.objects.create(name=folder_name, space=self)


class Folder(models.Model):
    name = models.CharField(max_length=100)
    space = models.ForeignKey(
        Space, on_delete=models.CASCADE, related_name='folders')
    created_at = models.DateTimeField(auto_now_add=True)

   

    def __str__(self):
        return self.name


class Project(models.Model):
    name = models.CharField(max_length=100)
    folder = models.ForeignKey(
        Folder, on_delete=models.CASCADE, related_name='projects')
    tags = models.ManyToManyField(Tag, related_name='projects')
    created_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField(null=True, blank=True)
    # Consider an Enum for predefined statuses
    status = models.CharField(max_length=100, default='active')
    owner = models.ForeignKey(
        'api.UserProfile', on_delete=models.CASCADE, related_name='owned_projects')

    def is_overdue(self):
        return self.due_date < timezone.now() if self.due_date else False
