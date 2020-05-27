from rest_framework.pagination import LimitOffsetPagination, PageNumberPagination


class ExpenseLimitOffsetPagiantion(LimitOffsetPagination):
    default_limit = 2
    max_limit = 5


class ExpenseSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 10
