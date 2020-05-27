from django.shortcuts import render
from .models import Expense, Category
from .serializers import ExpenseSerializer
from .serializers import CategorySerializer
from rest_framework import generics, permissions
from .pagination import ExpenseLimitOffsetPagiantion, ExpenseSetPagination

from rest_framework.decorators import api_view
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.request import Request

from django.db.models import Sum
from django.http import JsonResponse
# from django.contrib.admin.views.decorators import staff_member_required
# from rest_framework.permissions import IsAdminUser


# @staff_member_required
class ExpenseList(generics.ListCreateAPIView):
    # if request.user.is_authenticated:
    # parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated]  # added
    serializer_class = ExpenseSerializer

    pagination_class = ExpenseSetPagination

    def perform_create(self, serializer):  # added
        serializer.save(user=self.request.user)

    def get_queryset(self):
        """
        for the currently authenticated user.
        """
        user = self.request.user
        # print(user)

        expenses = Expense.objects.filter(
            user=user).exclude(delete_status=True)
        if expenses is not None:
            return self.paginate_queryset(expenses)

    def list(self, request, format=None):
        # Note the use of `get_queryset()` instead of `self.queryset`
        # serializer_class = ExpenseSerializer(data=request.data)

        queryset = self.get_queryset()
        serializer = ExpenseSerializer(queryset, many=True)
        # return Response(serializer.data)
        return self.get_paginated_response(serializer.data)


class ExpenseDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]  # added
    # queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

    # parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        """
        for the currently authenticated user.
        """
        user = self.request.user
        # print(user)

        expenses = Expense.objects.filter(
            user=user).exclude(delete_status=True)
        if expenses is not None:
            return expenses

    def details(self, request, pk):
        queryset = self.get_queryset(id=pk)
        serializer = ExpenseSerializer(queryset, many=False)
        if request.method == "DELETE":
            return Response('ITEM SUCCESSFULLY DELETED!')

        return Response(serializer.data)


class SearchExpense(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]  # check authorization

    def get_queryset(self):
        query = self.request.query_params.get("q", None)
        # print(query)

        user = self.request.user
        expenses = Expense.objects.search(query=query).filter(
            user=user).exclude(delete_status=True)
        if expenses is not None:
            return expenses

    def list(self, request, format=None):
        # Note the use of `get_queryset()` instead of `self.queryset`

        queryset = self.get_queryset()
        serializer = ExpenseSerializer(queryset, many=True)
        return Response(serializer.data)


class CategoryList(generics.ListCreateAPIView):
    # if request.user.is_authenticated:
    permission_classes = [permissions.IsAuthenticated]  # added
    serializer_class = CategorySerializer

    def get_queryset(self):
        """
        for the currently authenticated user.
        """
        return Category.objects.all().exclude(status=False)

    def list(self, request):
        # Note the use of `get_queryset()` instead of `self.queryset`
        queryset = self.get_queryset()
        serializer = CategorySerializer(queryset, many=True)
        return Response(serializer.data)


# Expense Report generate
class handleExpenseReport(generics.ListAPIView):

    permission_classes = [permissions.IsAuthenticated]  # added
    pagination_class = ExpenseSetPagination
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        category = self.request.query_params.get("category", None)
        start_date = self.request.query_params.get("start_date", None)
        end_date = self.request.query_params.get("end_date", None)
        # print(category, start_date, end_date)

        user = self.request.user
        if category is not None:
            expenses = Expense.objects.filter(expense_date__range=(
                start_date, end_date),
                category=category, user=user).exclude(delete_status=True)

        if expenses is not None:
            # print(expenses)
            return expenses

    def list(self, request, format=None):
        # Note the use of `get_queryset()` instead of `self.queryset`
        queryset = self.get_queryset()
        serializer = ExpenseSerializer(queryset, many=True)

        # print(repr(serializer))
        return Response(serializer.data)


@api_view(['GET'])
def handleExpenseJournal(request, *args, **kwargs):
    start_date = request.GET.get("start_date", None)
    end_date = request.GET.get("end_date", None)
    print(start_date, end_date)

    user = request.user
    # print(user)
    if start_date is not None:
        expenses = Expense.objects.values('category__name').annotate(cat_sum=Sum('total')).filter(
            expense_date__range=(start_date, end_date), user=user).exclude(delete_status=True).order_by()

    # print(expenses)
    my_list = []
    my_list.extend(expenses)

    data = {}
    data['journal'] = True
    data['results'] = my_list

    return JsonResponse(data, safe=False)
