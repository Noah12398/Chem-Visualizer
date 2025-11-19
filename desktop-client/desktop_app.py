import sys, io
import requests
from PyQt5.QtWidgets import QApplication, QWidget, QVBoxLayout, QPushButton, QFileDialog, QLabel, QTableWidget, QTableWidgetItem, QMessageBox, QListWidget
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure

API_BASE = 'http://localhost:8000/api'
AUTH = ('admin','admin')  # BasicAuth

class MainWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle('Chemical Equipment Visualizer - Desktop')
        self.resize(900,600)
        layout = QVBoxLayout()
        self.upload_btn = QPushButton('Upload CSV')
        self.upload_btn.clicked.connect(self.upload_file)
        layout.addWidget(self.upload_btn)

        self.history_btn = QPushButton('Refresh History')
        self.history_btn.clicked.connect(self.load_history)
        layout.addWidget(self.history_btn)

        self.listw = QListWidget()
        self.listw.itemClicked.connect(self.on_select)
        layout.addWidget(self.listw)

        self.table = QTableWidget()
        layout.addWidget(self.table)

        self.canvas = FigureCanvas(Figure(figsize=(5,3)))
        layout.addWidget(self.canvas)
        self.ax = self.canvas.figure.subplots()

        self.setLayout(layout)
        self.datasets = []

    def upload_file(self):
        fname, _ = QFileDialog.getOpenFileName(self, 'Open CSV', '', 'CSV Files (*.csv)')
        if not fname:
            return
        with open(fname, 'rb') as f:
            files = {'file': f}
            try:
                r = requests.post(f"{API_BASE}/upload/", files=files, auth=AUTH)
                r.raise_for_status()
                QMessageBox.information(self, 'Success', 'File uploaded')
                self.load_history()
            except Exception as e:
                QMessageBox.critical(self, 'Error', str(e))

    def load_history(self):
        try:
            r = requests.get(f"{API_BASE}/datasets/", auth=AUTH)
            r.raise_for_status()
            self.datasets = r.json()
            self.listw.clear()
            for ds in self.datasets:
                self.listw.addItem(f"{ds['id']}: {ds['file'].split('/')[-1]} - {ds['uploaded_at']}")
            if self.datasets:
                self.show_summary(self.datasets[0])
        except Exception as e:
            QMessageBox.critical(self, 'Error', str(e))

    def on_select(self, item):
        idx = self.listw.currentRow()
        ds = self.datasets[idx]
        self.show_summary(ds)

    def show_summary(self, ds):
        s = ds.get('summary',{})
        averages = s.get('averages',{})
        types = s.get('type_distribution',{})

        self.table.clear()
        self.table.setColumnCount(2)
        self.table.setRowCount(len(averages))
        self.table.setHorizontalHeaderLabels(['Metric','Value'])
        for i,(k,v) in enumerate(averages.items()):
            self.table.setItem(i,0,QTableWidgetItem(k))
            self.table.setItem(i,1,QTableWidgetItem(str(v)))

        self.ax.clear()
        labels = list(averages.keys())
        vals = [averages[k] if averages[k] is not None else 0 for k in labels]
        self.ax.bar(labels, vals)
        self.ax.set_title('Averages')
        self.canvas.draw()

if __name__=='__main__':
    app = QApplication(sys.argv)
    w = MainWindow()
    w.show()
    sys.exit(app.exec_())
