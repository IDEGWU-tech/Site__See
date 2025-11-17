# Site See — Visit Planning & Booking (Prototype)

This workspace contains a front-end prototype and backend stubs for the Site See booking system.

Branding: purple, gold, white. Add the provided logo image file (from your attachments) to `assets/logo.png` so the UI uses it.

Files:
- `index.html` — Frontend UI (HTML/CSS/JS)
- `css/styles.css` — Styling using brand colors
- `js/app.js` — Frontend logic, 5-second welcome loading text, localStorage demo bookings
- `backend/php/book.php` — Example PHP endpoint to receive bookings (MySQL)
- `backend/python/app.py` — Flask example to receive bookings (Postgres)
- `backend/js/server.js` — Minimal Express server (JS)
- `sql/mysql_schema.sql` — MySQL schema
- `sql/postgres_schema.sql` — Postgres schema

Quick start (frontend only):
1. Put your attached logo image at `assets/logo.png`.
2. Open `index.html` in your browser (double-click) to view the prototype.

Running backends (optional):

PHP (built-in server):
```
# from workspace root (Site_See)
php -S localhost:8000 -t .
# Then the PHP endpoint is available at http://localhost:8000/backend/php/book.php
```

Python Flask (Postgres):
```
python -m venv venv; .\venv\Scripts\Activate.ps1; pip install flask psycopg2-binary
$env:SITESEE_PG_DSN = 'postgres://user:pass@localhost:5432/site_see'
python backend/python/app.py
```

Node (Express):
```
cd backend/js
npm init -y
npm install express body-parser
node server.js
```

Databases:
- MySQL: run `sql/mysql_schema.sql` to create `bookings` table.
- PostgreSQL: run `sql/postgres_schema.sql` to create `bookings` table.

Notes & next steps:
- This is a prototype UI/UX. The frontend saves bookings to `localStorage` for demonstration and attempts to POST to the PHP endpoint if present.
- Copy the attached logo image into `assets/logo.png` to show your brand image on the site.
- I can: wire server endpoints to actually persist bookings, add authentication, or create admin dashboards. Tell me which backend language you prefer for the production API and which DB to use as primary.
