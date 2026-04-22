# Frontend Admin UI

Simple React + TypeScript + Vite admin UI wired to the NestJS backend.

## Quick Start

1. Ensure the backend is running (default on `http://localhost:3000`).
2. Optionally set the API URL via `VITE_API_URL`:

   - Create `frontend/.env` with:
     ```env
     VITE_API_URL=http://localhost:3000
     ```

3. Install and run the frontend:

```powershell
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

## Features

- Users: list, create, delete
- Products: list, create, delete
- Orders: list, create with multiple items
- Order Items: list, create, delete

## Notes

- Backend CORS is enabled in `backend/src/main.ts`, so direct calls from the Vite dev server should work.
- Configure `VITE_API_URL` if your backend runs on a different host/port.
