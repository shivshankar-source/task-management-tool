# Task & Engagement Management Backend

## Setup
```bash
npm install
cp .env.example .env
npm run dev
```

Required environment variables:
`MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `CLIENT_URL`, `PORT`.

## Scripts
- `npm run dev` — development server
- `npm start` — production server
- `npm test` — backend tests

## Main endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/tasks`
- `PATCH /api/tasks/:id/status`
- `PATCH /api/tasks/:id/assign`
- `GET /api/tasks/dashboard/summary`
- Engagement, client, service and user routes are available under `/api`.

See `TECHNICAL_DESIGN_NOTE.md` for architecture, authorization, workflow, recurring generation and scaling decisions.
