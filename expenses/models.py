from django.db import models
from django.conf import settings
from django.db.models import Q

User = settings.AUTH_USER_MODEL

# Create your models here.


class Category(models.Model):
    name = models.CharField(max_length=240)
    status = models.BooleanField(default=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "categories"


class ExpenseQuerySet(models.QuerySet):
    def search(self, query):
        lookup = (
            Q(merchant__icontains=query) |
            Q(category_id__name__icontains=query) |
            Q(description__icontains=query)
        )
        return self.filter(lookup)


class ExpenseManager(models.Manager):
    def get_queryset(self):
        return ExpenseQuerySet(self.model, using=self._db)

    def search(self, query=None):
        if query is None:
            return self.get_queryset().none()
        return self.get_queryset().search(query)


class Expense(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    expense_date = models.DateField(auto_now=False, auto_now_add=False)
    merchant = models.CharField(max_length=240)
    category = models.ForeignKey(
        Category, null=True, related_name='expenses', on_delete=models.SET_NULL)
    description = models.TextField(null=True, blank=True)
    attachment = models.ImageField(
        upload_to='expenses/', blank=True, null=True)
    tax = models.FloatField(null=True, blank=True)
    tip = models.FloatField(null=True, blank=True)
    amount = models.FloatField()
    total = models.FloatField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    delete_status = models.BooleanField(default=False)

    objects = ExpenseManager()

    def __str__(self):
        return (self.merchant)

    class Meta:
        ordering = ["-expense_date", "-updated", "-timestamp"]

    def get_absolute_url(self):
        return f"/expense/{self.pk}"

    def get_edit_url(self):
        return f"{self.get_absolute_url()}/edit"

    def get_delete_url(self):
        return f"{self.get_absolute_url()}/delete"
