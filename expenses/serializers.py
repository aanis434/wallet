from rest_framework import serializers
from .models import Expense, Category


class ExpenseSerializer(serializers.ModelSerializer):
    serializers.ImageField(use_url=True, required=False, allow_null=True)

    class Meta:
        model = Expense
        exclude = ['timestamp', 'updated', 'user']
        # fields = "__all__"

    def to_representation(self, instance):
        rep = super(ExpenseSerializer, self).to_representation(instance)
        rep['category_name'] = instance.category.name
        return rep


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        exclude = ['timestamp', 'updated', 'status']
