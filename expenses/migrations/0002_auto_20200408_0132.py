# Generated by Django 3.0.5 on 2020-04-07 19:32

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('expenses', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Expense',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('expense_date', models.DateTimeField()),
                ('merchant', models.CharField(max_length=240)),
                ('description', models.TextField()),
                ('attachment', models.ImageField(blank=True, null=True, upload_to='expenses/')),
                ('tax', models.FloatField(blank=True, null=True)),
                ('tip', models.FloatField(blank=True, null=True)),
                ('amount', models.FloatField()),
                ('total', models.FloatField()),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('category', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='expenses.Category')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-expense_date', '-updated', '-timestamp'],
            },
        ),
        migrations.DeleteModel(
            name='Expenses',
        ),
    ]
