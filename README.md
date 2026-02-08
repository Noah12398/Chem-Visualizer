# 🧪 Chemical Equipment Parameter Visualizer

A modern hybrid application (Web + Desktop) for visualizing and analyzing chemical equipment data from CSV uploads. Features beautiful UI, interactive charts, and comprehensive data analytics.

## ✨ Features

- **📤 CSV Upload**: Upload chemical equipment data via web or desktop interface
- **📊 Data Analysis**: Automatic calculation of statistical summaries (Mean, Count, Distribution)
- **📈 Interactive Visualizations**: 
  - Bar charts for average parameter values
  - Pie/Doughnut charts for equipment type distribution
  - Responsive and animated charts with vibrant gradients
- **📂 History Management**: Stores and displays last 5 uploaded datasets
- **📄 PDF Reports**: Download comprehensive PDF reports of dataset summaries
- **🔐 Authentication**: Basic authentication for secure access
- **🎨 Modern UI**: Gradient backgrounds, smooth animations, and premium design

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend** | Django + Django REST Framework | Common API backend |
| **Web Frontend** | React.js + Chart.js + MUI | Modern web interface |
| **Desktop Frontend** | PyQt5 + Matplotlib | Cross-platform desktop app |
| **Data Processing** | Pandas | CSV parsing & analytics |
| **Database** | SQLite | Dataset storage |
| **Authentication** | Basic Auth | Secure access control |

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- pip (Python package manager)
- npm (Node package manager)

## 🚀 Setup Instructions

### Backend (Django)

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run database migrations:
   ```bash
   python manage.py migrate
   ```

4. Create admin user (username: `admin`, password: `admin`):
   ```bash
   python create_admin.py
   ```

5. Start the Django server:
   ```bash
   python manage.py runserver
   ```
   Server will run at `http://localhost:8000`

### Web Frontend (React)

1. Navigate to web-frontend directory:
   ```bash
   cd web-frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm start
   ```
   Application will open at `http://localhost:3000`

4. Login with credentials: `admin` / `admin`

### Desktop Client (PyQt5)

1. Navigate to desktop-client directory:
   ```bash
   cd desktop-client
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the desktop application:
   ```bash
   python desktop_app.py
   ```

4. Login with credentials: `admin` / `admin`

## 📊 Sample Data

Use the provided `sample_equipment_data.csv` file for testing. It contains sample chemical equipment data with columns:
- Equipment Name
- Type
- Flowrate
- Pressure
- Temperature

## 🎯 Usage

1. **Login**: Use `admin` / `admin` credentials
2. **Upload CSV**: Click the upload button and select your CSV file
3. **View Analytics**: 
   - Summary statistics displayed automatically
   - Interactive charts show averages and distributions
4. **Download PDF**: Click "Download PDF" to save a report
5. **View History**: Access previously uploaded datasets from the sidebar

## 🌟 UI Highlights

### Web Application
- Gradient purple theme with smooth transitions
- Responsive Material-UI components
- Animated charts with vibrant colors
- Modern glassmorphism effects
- User-friendly file upload with drag-and-drop

### Desktop Application
- Modern PyQt5 interface with gradient headers
- Tabbed layout for organized data viewing
- Professional color scheme matching web app
- Integrated Matplotlib charts
- Native file dialogs and notifications

## 📝 API Endpoints

- `POST /api/upload/` - Upload CSV file
- `GET /api/datasets/` - List all datasets (last 5)
- `GET /api/datasets/<id>/` - Get specific dataset details
- `GET /api/datasets/<id>/pdf/` - Download PDF report

## 🔒 Security

- Basic Authentication required for all endpoints
- CORS enabled for local development
- Session-based authentication support

## 📦 Project Structure

```
Chemical/
├── backend/              # Django backend
│   ├── api/             # API app
│   ├── chem_visualizer/ # Project settings
│   └── media/           # Uploaded files
├── web-frontend/        # React web app
│   └── src/
│       ├── components/  # React components
│       └── App.js       # Main app
├── desktop-client/      # PyQt5 desktop app
│   └── desktop_app.py   # Main application
└── sample_equipment_data.csv
```

## 🤝 Contributing

This is an intern screening project. For production use, consider:
- Implementing proper user authentication (JWT/OAuth)
- Adding data validation and error handling
- Deploying backend to a production server
- Building production React bundle
- Adding unit and integration tests

## � Troubleshooting

### Web Frontend Issues

**Problem**: `Module not found: Error: Can't resolve '@mui/icons-material'`
- **Solution**: Run `npm install @mui/icons-material` in the `web-frontend` directory

**Problem**: Webpack compilation errors with MUI
- **Solution**: Run `npm install --legacy-peer-deps` to resolve peer dependency conflicts

**Problem**: 403 Forbidden errors when accessing API
- **Solution**: Make sure you've entered the correct credentials (`admin` / `admin`) when prompted

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'django'`
- **Solution**: Install dependencies with `pip install -r requirements.txt` in the `backend` directory

**Problem**: Database errors
- **Solution**: Run `python manage.py migrate` to apply migrations

### Desktop Client Issues

**Problem**: `ModuleNotFoundError: No module named 'PyQt5'`
- **Solution**: Install dependencies with `pip install -r requirements.txt` in the `desktop-client` directory

## �📄 License

This project is created for educational and screening purposes.

