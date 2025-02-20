from django.db import models
from Accounts.models import Customer
import uuid
from django.conf import settings
from django.db import models

# Category Model
class Category(models.Model):
    name = models.CharField(unique=True, max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

# Dish Model
class Dish(models.Model):
    name = models.CharField(unique=True, max_length=255)
    description = models.TextField(blank=True)
    recipes = models.TextField(null=False)
    price = models.FloatField(null=False)
    image = models.ImageField(upload_to="dishes/")
    category = models.ManyToManyField(Category, related_name="dishes")
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

# Order Model
ORDER_STATUS = [
    ('Pending', 'Pending'),
    ('Processing', 'Processing'),
    ('Completed', 'Completed'),
    ('Cancelled', 'Cancelled'),
]

class Order(models.Model):
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders")
    total_price = models.FloatField(default=0.0)
    status = models.CharField(max_length=20, choices=ORDER_STATUS, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def update_total_price(self):
        self.total_price = sum(item.subtotal for item in self.ordered_items.all())
        self.save()

    def update_status_from_payments(self):
        """ Update Order status based on Payment status """
        completed_payments = self.payments.filter(payment_status='Completed')
        if completed_payments.exists():
            self.status = 'Completed'
        else:
            self.status = 'Pending'
        self.save()

    def __str__(self):
        return f"Order {self.id} for {getattr(self.customer, 'email', 'Unknown Customer')}"

# Payment Model
PAYMENT_METHODS = [
    ('COD', 'Cash on Delivery'),
    ('Card', 'Card Payment'),
    ('Epay', 'E-Payment'),
]

class Payment(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="payments")
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="payments")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=20, choices=ORDER_STATUS, default='Pending')  
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHODS, default='COD')
    transaction_id = models.CharField(max_length=32, unique=True, default=uuid.uuid4().hex)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.order:
            self.order.status = self.payment_status  # Sync Payment status with Order
            self.order.save()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Payment {self.id} - Order {self.order.id} ({self.payment_method})"


# Ordered Item Model
class OrderedItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="ordered_items")
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE, related_name="ordered_items")
    quantity = models.PositiveIntegerField(default=1)
    subtotal = models.FloatField()  # quantity * dish.price
    
    def save(self, *args, **kwargs):
        self.subtotal = self.quantity * self.dish.price
        super().save(*args, **kwargs)
        self.order.update_total_price()  # ✅ Auto-update order total

    def __str__(self):
        return f"{self.quantity} x {self.dish.name} (Order {self.order.id})"

# Cart Model
class Cart(models.Model):
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="carts")
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE, related_name="cart_items")
    quantity = models.PositiveIntegerField(default=1)
    
    class Meta:
        unique_together = ('customer', 'dish')

    def __str__(self):
        return f"Cart of {self.customer.email} - {self.dish.name} ({self.quantity})"

