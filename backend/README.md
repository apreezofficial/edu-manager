Vanilla PHP backend for Delightsome Kids

API endpoints (built with plain PHP):

- POST /api/enroll.php  — accept JSON payload { "name": "...", "class": "..." }
- GET  /api/announcements.php — returns sample announcements

Run locally using PHP built-in server from workspace root:

```bash
cd backend
php -S localhost:8001
```

Then access endpoints like `http://localhost:8001/api/announcements.php`.
