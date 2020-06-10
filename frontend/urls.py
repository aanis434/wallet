from django.urls import path
from . import views
from django.views.generic import TemplateView

# // search_view

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html')),
    path('sign-in', TemplateView.as_view(template_name='index.html')),
    path('sign-up', TemplateView.as_view(template_name='index.html')),
    path('home', TemplateView.as_view(template_name='index.html')),
    path('expense-list', TemplateView.as_view(template_name='index.html')),
    path('expense/edit/<int:id>', TemplateView.as_view(template_name='index.html')),
    path('expense-create', TemplateView.as_view(template_name='index.html')),
    path('client-list', TemplateView.as_view(template_name='index.html')),
    path('item-list', TemplateView.as_view(template_name='index.html')),
    path('reports', TemplateView.as_view(template_name='index.html')),
    # path('*', TemplateView.as_view(template_name='index.html')),
]
