# Chemical Equipment Parameter Visualizer

## Quick start (local)

1. Backend
   - create virtualenv: `python -m venv venv && source venv/bin/activate`
   - `pip install -r backend/requirements.txt`
   - `cd backend`
   - `python manage.py migrate`
   - `python manage.py createsuperuser` (use `admin`/`admin` for demo)
   - `python manage.py runserver`

2. Web
   - `cd web-frontend`
   - `npm install`
   - `npm start` (dev server)

3. Desktop
   - create venv, install `desktop-client/requirements.txt`
   - run `python desktop-client/desktop_app.py`

Notes:
- API endpoints are under `/api/` (upload, datasets, datasets/<id>/pdf)
- Default demo uses BasicAuth (admin/admin). Replace with a secure auth for production.
