# Green Ledger Insights

React + Vite frontend with a FastAPI backend for CSV-based carbon insights.

## Prerequisites

- Node.js 18+
- npm
- Python 3.10+

## Local Setup

1. Clone and install frontend deps:

```sh
git clone <YOUR_GIT_URL>
cd green-ledger-insights
npm install
```

2. Install backend Python deps:

```sh
cd backend
python -m pip install -r requirements.txt
cd ..
```

3. Start frontend + backend together:

```sh
npm run dev:full
```

This starts:
- Frontend on Vite (port `8080`)
- Backend FastAPI on `http://127.0.0.1:8000`

## Run Services Separately

Frontend only:

```sh
npm run dev
```

Backend only:

```sh
npm run backend:dev
```

## Common Error: `ECONNREFUSED 127.0.0.1:8000`

If Vite shows proxy errors like:

```text
[vite] http proxy error: /api/... Error: connect ECONNREFUSED 127.0.0.1:8000
```

it means frontend is running but backend is not reachable.

Fix checklist:

1. Ensure backend is running on port `8000`:

```sh
npm run backend:dev
```

2. If port is already in use (`WinError 10048`), close old process or free port `8000`.

3. Reinstall backend deps if startup fails:

```sh
cd backend
python -m pip install -r requirements.txt
```

4. Reload frontend after backend is up.

## CSV Upload Notes

Upload endpoint: `POST /api/uploads/statements`

Required CSV columns:
- `date`
- `vendor`
- `amount`

Optional activity columns:
- `distance_km`
- `passenger_count`
- `freight_ton_km`

Amount parser accepts formats like:
- `1200`
- `Rs 1200`
- `INR 1200`
- `₹1200`
