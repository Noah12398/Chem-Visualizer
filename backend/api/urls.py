from django.urls import path
from .views import UploadCSVView, DatasetListView, DatasetDetailView, GeneratePDFView

urlpatterns = [
    path('upload/', UploadCSVView.as_view(), name='upload-csv'),
    path('datasets/', DatasetListView.as_view(), name='datasets-list'),
    path('datasets/<int:pk>/', DatasetDetailView.as_view(), name='dataset-detail'),
    path('datasets/<int:pk>/pdf/', GeneratePDFView.as_view(), name='dataset-pdf'),
]
