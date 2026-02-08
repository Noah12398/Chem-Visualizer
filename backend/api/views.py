import io
import pandas as pd
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import AllowAny
from django.http import HttpResponse
from django.contrib.auth.models import User
from .models import Dataset
from .serializers import DatasetSerializer, UserSerializer
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

NUMERIC_COLS = ['Flowrate','Pressure','Temperature']

class UploadCSVView(APIView):
    def post(self, request):
        csv_file = request.FILES.get('file')
        if not csv_file:
            return Response({'detail':'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            df = pd.read_csv(csv_file)
        except Exception as e:
            return Response({'detail':f'Error reading CSV: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

        total_count = len(df)
        averages = {}
        for col in NUMERIC_COLS:
            if col in df.columns:
                try:
                    averages[col] = float(df[col].dropna().astype(float).mean()) if not df[col].dropna().empty else None
                except Exception:
                    averages[col] = None
            else:
                averages[col] = None
        type_distribution = df['Type'].value_counts().to_dict() if 'Type' in df.columns else {}

        summary = {
            'total_count': int(total_count),
            'averages': averages,
            'type_distribution': type_distribution,
        }

        csv_file.seek(0)
        dataset = Dataset.objects.create(file=csv_file, summary=summary, uploaded_by=request.user)

        # Keep only last 5 datasets per user
        qs = Dataset.objects.filter(uploaded_by=request.user).order_by('-uploaded_at')
        if qs.count() > 5:
            for old in qs[5:]:
                old.file.delete(save=False)
                old.delete()

        serializer = DatasetSerializer(dataset)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class DatasetListView(generics.ListAPIView):
    serializer_class = DatasetSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            # Admin users see all datasets from all users
            return Dataset.objects.order_by('-uploaded_at')[:5]
        else:
            # Regular users see only their own datasets
            return Dataset.objects.filter(uploaded_by=user).order_by('-uploaded_at')[:5]


class DatasetDetailView(generics.RetrieveAPIView):
    serializer_class = DatasetSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Dataset.objects.all()
        else:
            return Dataset.objects.filter(uploaded_by=user)


class GeneratePDFView(APIView):
    def get(self, request, pk):
        try:
            dataset = Dataset.objects.get(pk=pk)
        except Dataset.DoesNotExist:
            return Response({'detail':'Dataset not found'}, status=status.HTTP_404_NOT_FOUND)

        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        p.setFont('Helvetica', 12)
        p.drawString(50, 750, f"Dataset Report - ID: {dataset.id}")
        p.drawString(50, 735, f"Uploaded at: {dataset.uploaded_at}")

        y = 700
        p.drawString(50, y, 'Summary:')
        y -= 20
        for k,v in dataset.summary.items():
            p.drawString(60, y, f"{k}: {v}")
            y -= 18
            if y < 50:
                p.showPage()
                y = 750
        p.save()
        buffer.seek(0)
        
        response = HttpResponse(buffer.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="dataset_{dataset.id}_report.pdf"'
        return response


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
