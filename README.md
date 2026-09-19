# Task & Engagement Management System

**Author:** Shivshankar  
**Role:** Full Stack Developer

A full-stack Task & Engagement Management System built with **React, Vite, Tailwind CSS, Node.js, Express, MongoDB, and Mongoose**. The application provides role-based workflows for **Admin, Manager, and Team Member** users, covering clients, service types, recurring/one-time engagements, task templates, task assignment, task execution, review workflows, and audit logging.

---

## 1. Project Overview

The system is designed for a services team that manages multiple clients and engagements. An engagement can be recurring, such as monthly GST compliance, or one-time, such as GST registration or a GST refund. Engagements can generate tasks from predefined templates, and tasks move through a controlled workflow until completion/review.

### User roles

| Role | Main responsibilities |
|---|---|
| **Admin** | Manage users, clients, service types, task templates and engagements; assign/reassign tasks; manage administrative records and audit logs. |
| **Manager** | Manage their assigned engagements, create/manage tasks for those engagements, assign tasks to team members, monitor task progress and handle review workflow. |
| **Team Member** | View assigned tasks, work on tasks, submit/update task status and complete assigned work. |

---

## 2. Key Features

### Authentication & authorization
- JWT-based authentication.
- Protected API routes.
- Role-based authorization for Admin, Manager and Team Member.
- Profile information and password update support.
- Session/token handling for authenticated requests.

### Client management
- Admin can create, update and delete clients.
- Client information is available when creating engagements.

### Service management
- Admin can create, update and delete service types.
- Supports **one-time** and **recurring** service types.
- Task templates can be associated with a service.

### Engagement management
- Create engagements for a client and service.
- Supports recurring periods such as monthly engagements.
- Prevents duplicate recurring periods through backend validation/lookup logic.
- Manager views are restricted to engagements managed by that manager.
- Recurring engagements can generate the next period.
- Generated tasks retain the correct creator/reviewer information.

### Task management
- Tasks are generated from engagement templates or created through the task workflow.
- Admin/Manager assignment and reassignment is persisted in MongoDB.
- Team members see tasks assigned to them.
- Task status workflow supports states such as not started, active, waiting for client/review and completed.
- Task history and audit information are available through the backend.
- Task assignment changes are not merely visual: the selected member is stored in the database and returned by the API.

### Audit logging
- Important administrative and workflow actions are recorded.
- Audit entries include the acting user, action, entity and relevant metadata.
- Admin can access audit logs.

### Dashboard & UI
- Separate role-aware dashboard experiences.
- Task counts for open/completed/failed/review-related states.
- Search and status filters.
- Consistent dark gradient visual design across Admin, Manager and Team Member interfaces.
- Responsive cards and controls for task/engagement management.

---

## 3. Technology Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS
- Morgan

### Testing
- Node.js built-in test runner
- Supertest dependency for API testing

---

## 4. Folder Structure

```text
Task_Management/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   └── authController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── error.js
│   │   ├── models/
│   │   │   ├── AuditLog.js
│   │   │   ├── Client.js
│   │   │   ├── Engagement.js
│   │   │   ├── ServiceType.js
│   │   │   ├── Task.js
│   │   │   ├── TaskTemplate.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── clientRoutes.js
│   │   │   ├── engagementRoutes.js
│   │   │   ├── serviceRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── services/
│   │   │   ├── auditService.js
│   │   │   ├── engagementService.js
│   │   │   └── taskService.js
│   │   ├── app.js
│   │   ├── server.js
│   │   └── seed.js
│   ├── test/
│   │   └── workflow.test.js
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   ├── ERD.md
│   └── TECHNICAL_DESIGN_NOTE.md
│
├── .gitignore
└── README.md
```

---

## 5. Prerequisites

Install the following before running the project:

- **Node.js 18+** recommended
- **npm**
- **MongoDB** local instance or MongoDB Atlas
- A modern browser such as Chrome or Edge

---

## 6. Backend Setup

Open a terminal in the `backend` directory:

```bash
cd backend
npm install
```

Create a `.env` file from `.env.example`.

### Example `.env`

```env
MONGO_URI=mongodb://127.0.0.1:27017/task_manager
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
PORT=5000
```

For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

### Start backend in development

```bash
npm run dev
```

Backend will run at:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

---

## 7. Seed Demo Data

The project includes a seed script that creates demo users, clients, a recurring GST service and task templates.

From `backend/`:

```bash
npm run seed
```

### Demo accounts

All seeded users use the password:

```text
123456
```

| Role | Email |
|---|---|
| Admin | `admin@example.com` |
| Manager | `manager@example.com` |
| Team Member | `employee@example.com` |

> The seed script clears the seeded collections before inserting its demo records. Do not run it against a database containing data you want to keep.

---

## 8. Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
```

The frontend uses the following API URL by default:

```text
http://localhost:5000/api
```

To use another backend URL, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Start frontend

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## 9. Run the Complete Application

You need **two terminals**.

### Terminal 1 — Backend

```bash
cd backend
npm install
npm run dev
```

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Then visit:

```text
http://localhost:5173
```

---

## 10. Typical Workflow

### Admin workflow

```text
Create users
    ↓
Create clients
    ↓
Create service types
    ↓
Create task templates
    ↓
Create engagement
    ↓
Assign/reassign task when required
    ↓
Monitor audit logs
```

### Manager workflow

```text
View managed engagements
    ↓
Create/manage engagement tasks
    ↓
Assign tasks to team members
    ↓
Monitor task progress
    ↓
Review submitted work
    ↓
Complete/rework task according to workflow
```

### Team Member workflow

```text
Login
    ↓
View assigned tasks
    ↓
Start / work on task
    ↓
Update task status
    ↓
Submit work for review
```

---

## 11. Important API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Users

```text
GET    /api/users
GET    /api/users/me
PATCH  /api/users/me
POST   /api/users
PATCH  /api/users/:id
DELETE /api/users/:id
```

### Clients

```text
GET    /api/clients
POST   /api/clients
PATCH  /api/clients/:id
DELETE /api/clients/:id
```

### Services & templates

```text
GET    /api/services
POST   /api/services
PATCH  /api/services/:id
DELETE /api/services/:id
POST   /api/services/:id/templates
GET    /api/services/:id/templates
PATCH  /api/services/:id/templates/:templateId
DELETE /api/services/:id/templates/:templateId
```

### Engagements

```text
GET    /api/engagements
POST   /api/engagements
PATCH  /api/engagements/:id
DELETE /api/engagements/:id
POST   /api/engagements/:id/generate-next
```

### Tasks

```text
POST   /api/tasks
GET    /api/tasks
GET    /api/tasks/dashboard
PATCH  /api/tasks/:id
PATCH  /api/tasks/:id/status
PATCH  /api/tasks/:id/assign
DELETE /api/tasks/:id
GET    /api/tasks/:id/history
```

### Audit logs

```text
GET /api/audit-logs
```

The audit-log endpoint is restricted to Admin users.

---

## 12. Testing

From the backend directory:

```bash
npm test
```

The backend also includes Supertest as a development dependency for API-level testing.

---

## 13. Production Build

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

### Backend

```bash
cd backend
npm start
```

Before deployment, configure production environment variables, especially `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and `PORT`.

---

## 14. Security Notes

- Do not commit `.env` files.
- Use a strong random `JWT_SECRET` in production.
- Use a production MongoDB connection with appropriate access controls.
- Restrict CORS to the deployed frontend origin.
- Do not use the demo credentials in production.

---

## 15. Author

**Shivshankar**  
Full Stack Developer

Built as a full-stack Task & Engagement Management project using the MERN-oriented JavaScript ecosystem.
