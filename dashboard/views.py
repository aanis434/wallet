from django.shortcuts import render
from expenses.models import Expense, Category

from django.db.models import Sum, Count
from django.http import JsonResponse, HttpResponse
import datetime

from rest_framework.decorators import api_view


# Create your views here.

@api_view(['GET'])
def expense_summary(request):
    current_date = datetime.datetime.now()
    current_month = current_date.month
    current_year = current_date.year
    # print(current_month, current_year)

    user = request.user
    current_month_expenses = Expense.objects.filter(
        expense_date__year=current_year, expense_date__month=current_month, user=user).exclude(delete_status=True).aggregate(Sum('total'))

    total_expenses = Expense.objects.filter(user=user).exclude(
        delete_status=True).aggregate(Sum('total'))

    total_year = Expense.objects.values('expense_date__year').annotate(
        Count('expense_date__year')).order_by()

    # print(total_year)
    years = []

    for value in total_year:
        # print(value["expense_date__year"])
        years.append(value["expense_date__year"])

    # print(years)

    data = {}
    data['total_expense'] = total_expenses
    data['current_month_expense'] = current_month_expenses
    data['total_years'] = years

    return JsonResponse(data, safe=False)


@api_view(['GET'])
def expense_chart(request, *args, **kwargs):
    get_year = request.GET.get("year", None)
    current_date = datetime.datetime.now()
    current_year = current_date.year

    if get_year is None:
        get_year = current_year

    # print(current_month, current_year)

    user = request.user
    # print(user)

    yearly_total_expenses = Expense.objects.filter(
        expense_date__year=get_year, user=user).exclude(delete_status=True).aggregate(Sum('total'))

    all_category = Expense.objects.values('category__name').annotate(Count('category')).filter(
        expense_date__year=get_year, user=user).exclude(delete_status=True).order_by('category__name')

    month_expenses = {}
    month_expenses[0] = Expense.objects.values('category__name').annotate(Sum('total')).filter(
        expense_date__year=get_year, expense_date__month=1, user=user).exclude(delete_status=True).order_by('category__name')

    month_expenses[1] = Expense.objects.values('category__name').annotate(Sum('total')).filter(
        expense_date__year=get_year, expense_date__month=2, user=user).exclude(delete_status=True).order_by('category__name')

    month_expenses[2] = Expense.objects.values('category__name').annotate(Sum('total')).filter(
        expense_date__year=get_year, expense_date__month=3, user=user).exclude(delete_status=True).order_by('category__name')

    month_expenses[3] = Expense.objects.values('category__name').annotate(Sum('total')).filter(
        expense_date__year=get_year, expense_date__month=4, user=user).exclude(delete_status=True).order_by('category__name')

    month_expenses[4] = Expense.objects.values('category__name').annotate(Sum('total')).filter(
        expense_date__year=get_year, expense_date__month=5, user=user).exclude(delete_status=True).order_by('category__name')

    month_expenses[5] = Expense.objects.values('category__name').annotate(Sum('total')).filter(
        expense_date__year=get_year, expense_date__month=6, user=user).exclude(delete_status=True).order_by('category__name')

    month_expenses[6] = Expense.objects.values('category__name').annotate(Sum('total')).filter(
        expense_date__year=get_year, expense_date__month=7, user=user).exclude(delete_status=True).order_by('category__name')

    month_expenses[7] = Expense.objects.values('category__name').annotate(Sum('total')).filter(
        expense_date__year=get_year, expense_date__month=8, user=user).exclude(delete_status=True).order_by('category__name')

    month_expenses[8] = Expense.objects.values('category__name').annotate(Sum('total')).filter(
        expense_date__year=get_year, expense_date__month=9, user=user).exclude(delete_status=True).order_by('category__name')

    month_expenses[9] = Expense.objects.values('category__name').annotate(Sum('total')).filter(
        expense_date__year=get_year, expense_date__month=10, user=user).exclude(delete_status=True).order_by('category__name')

    month_expenses[10] = Expense.objects.values('category__name').annotate(Sum('total')).filter(
        expense_date__year=get_year, expense_date__month=11, user=user).exclude(delete_status=True).order_by('category__name')

    month_expenses[11] = Expense.objects.values('category__name').annotate(Sum('total')).filter(
        expense_date__year=get_year, expense_date__month=12, user=user).exclude(delete_status=True).order_by('category__name')

    # print(month_expenses)

    data = [
        ["Month", ],
        ["Jan", ],
        ["Feb", ],
        ["Mar", ],
        ["Apr", ],
        ["May", ],
        ["Jun", ],
        ["Jul", ],
        ["Aug", ],
        ["Sep", ],
        ["Oct", ],
        ["Nov", ],
        ["Dec", ],
    ]

    if len(all_category) > 0:
        for value in all_category:
            data[0].append(value['category__name'])
            # print(value['category__name'])

        for index in range(len(data)-1):
            # print(index+1)
            index = index+1
            for value in range(len(data[0])-1):
                # print(value)
                data[index].append(0)

    for key, value in month_expenses.items():
        # print(key, value)
        key = key + 1
        # print("key index", month_expenses.index(key))
        if len(value) > 0:
            for val in value:
                for i in range(len(data)):
                    # print(i)
                    get_cat_index = data[0].index(val['category__name'])
                    if i == key:
                        data[i][get_cat_index] = val['total__sum']

    # print(data)

    datas = {}
    datas['chart_total'] = yearly_total_expenses
    datas['chart'] = data

    return JsonResponse(datas, safe=False)
