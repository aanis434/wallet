from django.urls import path
from . import views

# // search_view

urlpatterns = [
    path('expense/summary/', views.expense_summary, name='expense-summary'),
    path('expense/chart/', views.expense_chart, name='expense-chart'),
]
