import sys
import io
import requests
from PyQt5.QtWidgets import (
    QApplication, QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton,
    QFileDialog, QTableWidget, QTableWidgetItem, QMessageBox, QListWidget,
    QFrame, QSplitter, QDialog, QLineEdit, QTabWidget
)
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QFont, QPalette, QColor
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure

API_BASE = 'http://localhost:8000/api'
AUTH = ('admin', 'admin')  # BasicAuth


class MainWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Chemical Equipment Visualizer - Desktop Client")
        self.resize(1200, 700)
        
        # Set modern color palette
        palette = QPalette()
        palette.setColor(QPalette.Window, QColor(245, 245, 247))
        palette.setColor(QPalette.WindowText, QColor(33, 33, 33))
        self.setPalette(palette)

        # ROOT LAYOUT
        main_layout = QVBoxLayout()
        main_layout.setSpacing(0)
        main_layout.setContentsMargins(0, 0, 0, 0)
        self.setLayout(main_layout)

        # HEADER ------------------------------
        header = QLabel("🧪 Chemical Equipment Visualizer")
        header.setAlignment(Qt.AlignCenter)
        header.setFont(QFont("Segoe UI", 18, QFont.Bold))
        header.setStyleSheet("""
            background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                stop:0 #667eea, stop:1 #764ba2);
            color: white;
            padding: 20px;
            border-radius: 0px;
        """)
        main_layout.addWidget(header)

        # TOOLBAR ------------------------------
        toolbar_widget = QWidget()
        toolbar_widget.setStyleSheet("background: white; padding: 10px;")
        toolbar = QHBoxLayout(toolbar_widget)

        self.upload_btn = QPushButton("📤 Upload CSV")
        self.upload_btn.clicked.connect(self.upload_file)
        self.upload_btn.setStyleSheet("""
            QPushButton {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #667eea, stop:1 #764ba2);
                color: white;
                border: none;
                padding: 10px 20px;
                font-size: 14px;
                font-weight: bold;
                border-radius: 6px;
            }
            QPushButton:hover {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #764ba2, stop:1 #667eea);
            }
        """)

        self.refresh_btn = QPushButton("🔄 Refresh")
        self.refresh_btn.clicked.connect(self.load_history)
        self.refresh_btn.setStyleSheet("""
            QPushButton {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #f093fb, stop:1 #f5576c);
                color: white;
                border: none;
                padding: 10px 20px;
                font-size: 14px;
                font-weight: bold;
                border-radius: 6px;
            }
            QPushButton:hover {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #f5576c, stop:1 #f093fb);
            }
        """)

        self.pdf_btn = QPushButton("📄 Download PDF")
        self.pdf_btn.clicked.connect(self.download_pdf)
        self.pdf_btn.setStyleSheet("""
            QPushButton {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #11998e, stop:1 #38ef7d);
                color: white;
                border: none;
                padding: 10px 20px;
                font-size: 14px;
                font-weight: bold;
                border-radius: 6px;
            }
            QPushButton:hover {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #38ef7d, stop:1 #11998e);
            }
        """)

        toolbar.addWidget(self.upload_btn)
        toolbar.addWidget(self.refresh_btn)
        toolbar.addWidget(self.pdf_btn)
        toolbar.addStretch()

        main_layout.addWidget(toolbar_widget)

        # CONTENT AREA
        content_widget = QWidget()
        content_widget.setStyleSheet("background: #f5f5f7;")
        content_layout = QHBoxLayout(content_widget)
        content_layout.setContentsMargins(15, 15, 15, 15)
        content_layout.setSpacing(15)
        main_layout.addWidget(content_widget)

        # SPLITTER -----------------------------
        splitter = QSplitter(Qt.Horizontal)
        content_layout.addWidget(splitter)

        # LEFT PANEL: List of datasets --------
        left_widget = QWidget()
        left_widget.setStyleSheet("""
            QWidget {
                background: white;
                border-radius: 10px;
            }
        """)
        left_layout = QVBoxLayout(left_widget)
        left_layout.setContentsMargins(0, 0, 0, 0)

        title_widget = QWidget()
        title_widget.setStyleSheet("""
            background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                stop:0 #f093fb, stop:1 #f5576c);
            border-radius: 10px 10px 0 0;
            padding: 15px;
        """)
        title_layout = QVBoxLayout(title_widget)
        title = QLabel("📂 Upload History")
        title.setFont(QFont("Segoe UI", 14, QFont.Bold))
        title.setStyleSheet("color: white;")
        title_layout.addWidget(title)
        left_layout.addWidget(title_widget)

        self.listw = QListWidget()
        self.listw.setStyleSheet("""
            QListWidget {
                font-size: 13px;
                border: none;
                padding: 10px;
                background: white;
            }
            QListWidget::item {
                padding: 10px;
                border-radius: 5px;
                margin: 2px;
            }
            QListWidget::item:selected {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 rgba(102, 126, 234, 0.3), stop:1 rgba(118, 75, 162, 0.3));
                border-left: 4px solid #667eea;
            }
            QListWidget::item:hover {
                background: #f0f0f0;
            }
        """)
        self.listw.itemClicked.connect(self.on_select)
        left_layout.addWidget(self.listw)

        splitter.addWidget(left_widget)

        # RIGHT PANEL: Tabs for Table + Chart ----------
        right_widget = QWidget()
        right_widget.setStyleSheet("background: transparent;")
        right_layout = QVBoxLayout(right_widget)
        right_layout.setContentsMargins(0, 0, 0, 0)
        
        self.tabs = QTabWidget()
        self.tabs.setStyleSheet("""
            QTabWidget::pane {
                border: none;
                background: white;
                border-radius: 10px;
            }
            QTabBar::tab {
                background: #e0e0e0;
                color: #333;
                padding: 10px 20px;
                margin-right: 5px;
                border-radius: 5px 5px 0 0;
                font-weight: bold;
            }
            QTabBar::tab:selected {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #667eea, stop:1 #764ba2);
                color: white;
            }
        """)
        
        # TABLE TAB
        table_widget = QWidget()
        table_widget.setStyleSheet("background: white; border-radius: 10px;")
        table_layout = QVBoxLayout(table_widget)
        
        tbl_title = QLabel("📊 Summary Statistics")
        tbl_title.setFont(QFont("Segoe UI", 14, QFont.Bold))
        tbl_title.setStyleSheet("color: #667eea; padding: 10px;")
        table_layout.addWidget(tbl_title)

        self.table = QTableWidget()
        self.table.setStyleSheet("""
            QTableWidget {
                font-size: 13px;
                gridline-color: #e0e0e0;
                border: none;
            }
            QHeaderView::section {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #667eea, stop:1 #764ba2);
                color: white;
                padding: 8px;
                font-weight: bold;
                border: none;
            }
            QTableWidget::item {
                padding: 8px;
            }
        """)
        table_layout.addWidget(self.table)
        
        # CHART TAB
        chart_widget = QWidget()
        chart_widget.setStyleSheet("background: white; border-radius: 10px;")
        chart_layout = QVBoxLayout(chart_widget)

        chart_title = QLabel("📈 Visual Analytics")
        chart_title.setFont(QFont("Segoe UI", 14, QFont.Bold))
        chart_title.setStyleSheet("color: #f5576c; padding: 10px;")
        chart_layout.addWidget(chart_title)

        self.canvas = FigureCanvas(Figure(figsize=(8, 5)))
        self.canvas.figure.patch.set_facecolor('white')
        chart_layout.addWidget(self.canvas)
        self.ax = self.canvas.figure.subplots()

        self.tabs.addTab(table_widget, "📊 Summary")
        self.tabs.addTab(chart_widget, "📈 Charts")
        
        right_layout.addWidget(self.tabs)
        splitter.addWidget(right_widget)
        
        splitter.setSizes([300, 900])

        self.datasets = []
        self.current_dataset = None

    # ------------------------ UPLOAD ------------------------
    def upload_file(self):
        fname, _ = QFileDialog.getOpenFileName(self, "Select CSV File", "", "CSV Files (*.csv)")
        if not fname:
            return

        with open(fname, "rb") as f:
            try:
                r = requests.post(f"{API_BASE}/upload/", files={"file": f}, auth=AUTH)
                r.raise_for_status()
                QMessageBox.information(self, "Success", "CSV uploaded successfully!")
                self.load_history()
            except Exception as e:
                QMessageBox.critical(self, "Error", str(e))

    # ------------------------ LOAD HISTORY ------------------
    def load_history(self):
        try:
            r = requests.get(f"{API_BASE}/datasets/", auth=AUTH)
            r.raise_for_status()
            self.datasets = r.json()
            self.listw.clear()

            for ds in self.datasets:
                filename = ds["file"].split("/")[-1]
                self.listw.addItem(f"📄 {ds['id']} — {filename}")

            if self.datasets:
                self.show_summary(self.datasets[0])
                self.current_dataset = self.datasets[0]

        except Exception as e:
            QMessageBox.critical(self, "Error", str(e))

    # ------------------------ SELECT ITEM -------------------
    def on_select(self):
        idx = self.listw.currentRow()
        ds = self.datasets[idx]
        self.show_summary(ds)
        self.current_dataset = ds

    # ------------------------ SUMMARY -----------------------
    def show_summary(self, ds):
        summary = ds.get("summary", {})
        averages = summary.get("averages", {})
        type_dist = summary.get("type_distribution", {})

        # Table
        self.table.clear()
        self.table.setColumnCount(2)
        self.table.setRowCount(len(averages) + len(type_dist) + 1)
        self.table.setHorizontalHeaderLabels(["Metric", "Value"])

        row = 0
        
        # Total count
        total = summary.get("total_count", 0)
        self.table.setItem(row, 0, QTableWidgetItem("Total Equipment"))
        self.table.setItem(row, 1, QTableWidgetItem(str(total)))
        row += 1

        # Averages
        for key, val in averages.items():
            self.table.setItem(row, 0, QTableWidgetItem(f"Avg {key}"))
            self.table.setItem(row, 1, QTableWidgetItem(f"{val:.3f}" if val else "N/A"))
            row += 1
            
        # Type distribution
        for key, val in type_dist.items():
            self.table.setItem(row, 0, QTableWidgetItem(f"Type: {key}"))
            self.table.setItem(row, 1, QTableWidgetItem(str(val)))
            row += 1

        self.table.resizeColumnsToContents()

        # Chart
        self.ax.clear()
        
        # Create subplots
        self.canvas.figure.clear()
        axes = self.canvas.figure.subplots(1, 2)
        
        # Bar chart for averages
        if averages:
            labels = list(averages.keys())
            values = [averages[k] if averages[k] else 0 for k in labels]
            colors = ['#667eea', '#764ba2', '#f093fb']
            axes[0].bar(labels, values, color=colors[:len(labels)], edgecolor='white', linewidth=2)
            axes[0].set_title("Average Values", fontsize=12, fontweight='bold', color='#667eea')
            axes[0].set_ylabel("Value", fontweight='bold')
            axes[0].grid(axis='y', alpha=0.3)
            
        # Pie chart for type distribution
        if type_dist:
            labels = list(type_dist.keys())
            values = list(type_dist.values())
            colors = ['#667eea', '#10b981', '#fb923c', '#ec4899', '#0ea5e9']
            axes[1].pie(values, labels=labels, autopct='%1.1f%%', 
                       colors=colors[:len(labels)], startangle=90,
                       textprops={'fontweight': 'bold'})
            axes[1].set_title("Type Distribution", fontsize=12, fontweight='bold', color='#f5576c')
        
        self.canvas.figure.tight_layout()
        self.canvas.draw()

    # ------------------------ DOWNLOAD PDF ------------------
    def download_pdf(self):
        if not self.current_dataset:
            QMessageBox.warning(self, "Warning", "Please select a dataset first")
            return
            
        try:
            dataset_id = self.current_dataset['id']
            r = requests.get(f"{API_BASE}/datasets/{dataset_id}/pdf/", auth=AUTH)
            r.raise_for_status()
            
            fname, _ = QFileDialog.getSaveFileName(
                self, "Save PDF", f"dataset_{dataset_id}_report.pdf", "PDF Files (*.pdf)"
            )
            
            if fname:
                with open(fname, 'wb') as f:
                    f.write(r.content)
                QMessageBox.information(self, "Success", f"PDF saved to {fname}")
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Failed to download PDF: {str(e)}")


class LoginDialog(QDialog):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Login")
        self.setFixedSize(350, 200)
        self.setStyleSheet("""
            QDialog {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:1,
                    stop:0 #667eea, stop:1 #764ba2);
            }
            QLineEdit {
                padding: 10px;
                border: 2px solid white;
                border-radius: 5px;
                font-size: 14px;
                background: white;
            }
            QPushButton {
                background: white;
                color: #667eea;
                border: none;
                padding: 10px 30px;
                font-size: 14px;
                font-weight: bold;
                border-radius: 5px;
            }
            QPushButton:hover {
                background: #f0f0f0;
            }
            QLabel {
                color: white;
                font-size: 18px;
                font-weight: bold;
            }
        """)
        
        layout = QVBoxLayout()
        layout.setSpacing(15)
        
        title = QLabel("🔐 Login to Continue")
        title.setAlignment(Qt.AlignCenter)
        layout.addWidget(title)
        
        self.username = QLineEdit()
        self.username.setPlaceholderText("Username")
        layout.addWidget(self.username)
        
        self.password = QLineEdit()
        self.password.setPlaceholderText("Password")
        self.password.setEchoMode(QLineEdit.Password)
        layout.addWidget(self.password)
        
        btn_layout = QHBoxLayout()
        login_btn = QPushButton("Login")
        login_btn.clicked.connect(self.check_login)
        btn_layout.addStretch()
        btn_layout.addWidget(login_btn)
        btn_layout.addStretch()
        
        layout.addLayout(btn_layout)
        self.setLayout(layout)
        
    def check_login(self):
        user = self.username.text()
        pwd = self.password.text()
        
        if not user or not pwd:
            QMessageBox.warning(self, "Error", "Username and password required")
            return

        # Verify credentials by making a simple request
        try:
            r = requests.get(f"{API_BASE}/datasets/", auth=(user, pwd))
            if r.status_code == 401:
                QMessageBox.warning(self, "Error", "Invalid credentials")
                return
            elif r.status_code >= 500:
                QMessageBox.warning(self, "Error", "Server error")
                return
            
            # Success
            self.credentials = (user, pwd)
            self.accept()
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Connection failed: {e}")

if __name__ == "__main__":
    app = QApplication(sys.argv)
    
    # Set application-wide font
    app.setFont(QFont("Segoe UI", 10))
    
    login = LoginDialog()
    if login.exec_() == QDialog.Accepted:
        global AUTH
        AUTH = login.credentials
        window = MainWindow()
        window.load_history()  # Load data on startup
        window.show()
        sys.exit(app.exec_())
    else:
        sys.exit(0)

