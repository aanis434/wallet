"""challan URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, resolve
from django.views.generic import TemplateView
from django.http import request

from django.conf import settings
from django.conf.urls.static import static

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

    path('admin', admin.site.urls),
    path('api/auth/', include('accounts.api.urls')),  # added
    path('expense/', include('expenses.urls')),
    path('dashboard/', include('dashboard.urls')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
