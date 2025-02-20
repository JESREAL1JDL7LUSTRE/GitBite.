from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('category', CategoryViewSet, basename='category')
router.register('dish', DishViewSet, basename='dish')
router.register('order', OrderListCreateViewset, basename='order-list')
router.register('payment', PaymentListCreateViewset, basename='payment')
router.register('cart', CartViewSet, basename='cart')

urlpatterns = [
    path('', include(router.urls)),
    path('payment-methods/', get_payment_methods, name='payment-methods'),
]
