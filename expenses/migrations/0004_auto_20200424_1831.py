# Generated by Django 3.0.5 on 2020-04-24 12:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('expenses', '0003_auto_20200420_0108'),
    ]

    operations = [
        migrations.AlterField(
            model_name='expense',
            name='expense_date',
            field=models.DateField(),
        ),
    ]