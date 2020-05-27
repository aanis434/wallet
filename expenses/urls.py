from django.urls import path
from . import views

# // search_view

urlpatterns = [
    path('list/', views.ExpenseList.as_view(), name='expense-list'),
    path('query/', views.SearchExpense.as_view(), name='expense-query'),
    path('category/list/', views.CategoryList.as_view(), name='category-list'),
    path('details/<str:pk>/', views.ExpenseDetail.as_view(), name='expense-details'),
    path('reports/', views.handleExpenseReport.as_view(), name='expense-report'),
    path('journal/', views.handleExpenseJournal, name='expense-journal'),
]
