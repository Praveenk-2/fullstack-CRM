# Mini CRM — Production MERN Stack Web Application

A full-stack **Mini CRM Web Application** built with the **MERN Stack** (MongoDB, Express.js, React, Node.js) for an interview assignment.

This application enables authenticated users to manage leads, companies, and tasks with strict role-based task status authorization, soft deletion, and real-time database dashboard aggregation.

---

## 🚀 Live Demo & Repository

* **Frontend Repository:** `CRM-Frontend/`
* **Backend Repository:** `CRM-Backend/`
* **Live Deployment:** Deployable on Vercel (Frontend), Render (Backend), and MongoDB Atlas (Database).

---

## 🌟 Key Features

* **Authentication & Authorization:** Secure register/login flow using JWT tokens and bcrypt password hashing. Protected routes on both frontend and backend.
* **Dashboard Overview:** Displays live database aggregated stats for Total Leads, Qualified Leads, Tasks Due Today, and Completed Tasks.
* **Leads Management:** Full CRUD with search, status filtering, server-side pagination, user & company assignment, and soft deletion.
* **Soft Delete Mechanism:** Soft-deletes leads by setting `isDeleted = true`. Soft-deleted leads are excluded from queries, company associations, and metrics.
* **Companies Management:** Create companies, list companies, and view company profile details with all associated non-deleted leads.
* **Tasks Management & Strict Task Authorization:** Create tasks for leads and assign them to users. **Backend Authorization:** Only the user assigned to a task can update its completion status (returns `403 Forbidden` if another user attempts the update).
* **Responsive Material UI (MUI):** Mobile drawer menu, sticky sidebar, topbar, clean card layouts, search bars, empty states, loading indicators, and confirmation dialogs.

---

## 🛠️ Mandatory Technology Stack

### Frontend
* **Framework:** React.js (Vite)
* **Routing:** React Router v6
* **UI Components:** Material UI (MUI `@mui/material`, `@mui/icons-material`)
* **HTTP Client:** Axios (Centralized instance with interceptors)

### Backend
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database & ODM:** MongoDB & Mongoose
* **Authentication:** JSON Web Tokens (JWT) & `bcryptjs`
* **Validation:** `express-validator`

---

## 📁 Project Structure

```text
MERN-CRM/
│
├── CRM-Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection & Memory Server fallback
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── companyController.js
│   │   │   ├── dashboardController.js
│   │   │   ├── leadController.js
│   │   │   ├── taskController.js
│   │   │   └── userController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # Bearer JWT verification middleware
│   │   │   ├── errorMiddleware.js    # 404 & Centralized error handler
│   │   │   └── validationMiddleware.js
│   │   ├── models/
│   │   │   ├── Company.js
│   │   │   ├── Lead.js
│   │   │   ├── Task.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── companyRoutes.js
│   │   │   ├── dashboardRoutes.js
│   │   │   ├── leadRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── companyService.js
│   │   │   ├── dashboardService.js
│   │   │   ├── leadService.js
│   │   │   ├── taskService.js
│   │   │   └── userService.js
│   │   ├── utils/
│   │   │   ├── generateToken.js
│   │   │   └── response.js
│   │   ├── app.js                    # Express app configuration
│   │   └── seed.js                   # Test data seeder script
│   ├── server.js                     # Backend entry point
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── CRM-Frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js              # Centralized Axios with Bearer token interceptor
│   │   │   ├── authApi.js
│   │   │   ├── companyApi.js
│   │   │   ├── dashboardApi.js
│   │   │   ├── leadApi.js
│   │   │   ├── taskApi.js
│   │   │   └── userApi.js
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── ConfirmDialog.jsx
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   ├── ErrorMessage.jsx
│   │   │   │   └── Loader.jsx
│   │   │   └── layout/
│   │   │       ├── MainLayout.jsx
│   │   │       ├── Sidebar.jsx
│   │   │       └── Topbar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Global Auth state manager
│   │   ├── pages/
│   │   │   ├── AddLead.jsx
│   │   │   ├── Companies.jsx
│   │   │   ├── CompanyDetails.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EditLead.jsx
│   │   │   ├── Leads.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Tasks.jsx
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx         # React Router + Protected Routes
│   │   ├── theme/
│   │   │   └── theme.js              # MUI custom theme
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## ⚡ Setup & Installation Instructions

### Prerequisites
* Node.js (v16+ recommended)
* npm (v8+ recommended)
* MongoDB database or local MongoDB instance (An automatic in-memory MongoDB fallback is built-in for zero-config testing if local MongoDB service is not running).

### 1. Backend Setup
```bash
cd CRM-Backend
npm install
```

Configure `.env` file inside `CRM-Backend/`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/mini_crm
JWT_SECRET=super_secret_crm_jwt_key_2026_interview
CLIENT_URL=http://localhost:5173
USE_MEMORY_DB_FALLBACK=true
```

Seed Database with Test Users & Sample Data:
```bash
npm run seed
```

Start Development Server:
```bash
npm run dev
```
Backend will run at `http://localhost:5000`.

---

### 2. Frontend Setup
```bash
cd CRM-Frontend
npm install
```

Configure `.env` file inside `CRM-Frontend/`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start Development Server:
```bash
npm run dev
```
Frontend will run at `http://localhost:5173`.

---

## 🔑 Test User Credentials

After running `npm run seed`, use any of the following credentials to test task authorization & permissions:

| User Name | Email Address | Password | Role / Purpose |
| :--- | :--- | :--- | :--- |
| **John** | `john@example.com` | `password123` | Assigned to John's tasks |
| **David** | `david@example.com` | `password123` | Assigned to David's tasks |
| **Admin** | `admin@example.com` | `password123` | Assigned to Admin's tasks |

---

## 🔒 Mandatory Task Authorization Rule

* **Interview Requirement:** ONLY the user assigned to a task can update its status (e.g. from `Pending` to `Completed`).
* **Backend Enforcement:** Inside `taskService.updateTaskStatus()`, the authenticated user ID (`req.user._id`) is checked against `task.assignedTo`.
* **HTTP 403 Response:** If a logged-in user attempts to update a task assigned to someone else, the backend returns:
  ```json
  {
    "success": false,
    "message": "Forbidden: Only the user assigned to this task can update its status"
  }
  ```
* **Frontend Behavior:** The UI shows a lock icon for unassigned tasks and displays an error alert if a 403 is received.

---

## 🗑️ Soft Delete Mechanism

* **Requirement:** Leads are soft-deleted and must never be physically removed from MongoDB.
* **Implementation:** When `DELETE /api/leads/:id` is invoked, `leadService.softDeleteLead()` executes:
  ```javascript
  Lead.findByIdAndUpdate(id, { isDeleted: true });
  ```
* **Filter Rules:** Every normal lead query, lead count, company detail view, search, and dashboard aggregation pipeline explicitly enforces `{ isDeleted: false }`.

---

## 📊 Dashboard Aggregation Logic

Endpoint: `GET /api/dashboard/stats`

Returns live database metrics computed via MongoDB queries/aggregations:
* `totalLeads`: Count of leads where `{ isDeleted: false }`
* `qualifiedLeads`: Count of leads where `{ isDeleted: false, status: 'Contacted' }` *(Assumption: Leads with status "Contacted" qualify as qualified leads)*
* `tasksDueToday`: Count of tasks where `dueDate` falls between the start of today (`00:00:00`) and end of today (`23:59:59`)
* `completedTasks`: Count of tasks where `{ status: 'Completed' }`

---

## 📖 Main API Endpoints Summary

### Auth APIs
* `POST /api/auth/register` - Register a new user
* `POST /api/auth/login` - Authenticate user & get JWT token
* `GET /api/auth/me` - Get logged-in user profile (Protected)

### Users API
* `GET /api/users` - Get all users for dropdown assignments (Protected)

### Dashboard API
* `GET /api/dashboard/stats` - Get aggregated dashboard metrics (Protected)

### Leads APIs
* `GET /api/leads` - List leads (supports `?page=1&limit=10&search=...&status=...`) (Protected)
* `GET /api/leads/:id` - Get lead details by ID (Protected)
* `POST /api/leads` - Create lead (Protected)
* `PUT /api/leads/:id` - Update lead (Protected)
* `PATCH /api/leads/:id/status` - Update lead status (Protected)
* `DELETE /api/leads/:id` - Soft delete lead (`isDeleted: true`) (Protected)

### Companies APIs
* `GET /api/companies` - List all companies (Protected)
* `GET /api/companies/:id` - Get company details & associated non-deleted leads (Protected)
* `POST /api/companies` - Create company (Protected)

### Tasks APIs
* `GET /api/tasks` - List tasks (supports `?status=...&assignedTo=...&lead=...`) (Protected)
* `GET /api/tasks/:id` - Get task by ID (Protected)
* `POST /api/tasks` - Create task for a lead (Protected)
* `PATCH /api/tasks/:id/status` - Update task status (**Restricted to assigned user, 403 otherwise**) (Protected)

---

## 🌐 Deployment Instructions

### Frontend (Vercel / Netlify)
1. Push `CRM-Frontend` to GitHub.
2. Connect repository to Vercel/Netlify.
3. Add Environment Variable:
   `VITE_API_URL=https://your-deployed-backend-url.onrender.com/api`
4. Build command: `npm run build`, Output directory: `dist`.

### Backend (Render / Railway)
1. Push `CRM-Backend` to GitHub.
2. Deploy service on Render as a Web Service.
3. Add Environment Variables:
   * `PORT=5000`
   * `MONGODB_URI=your_mongodb_atlas_connection_string`
   * `JWT_SECRET=your_production_jwt_secret`
   * `CLIENT_URL=https://your-frontend-domain.vercel.app`
4. Build command: `npm install`, Start command: `npm start`.

---

## ✅ Assumptions & Decisions

1. **Qualified Leads Definition:** Defined as leads having the status `"Contacted"`.
2. **MongoDB Connection Fallback:** An embedded `mongodb-memory-server` fallback is configured in `db.js` so reviewers can clone and run `npm run seed` / `npm run dev` instantly without installing local MongoDB binaries.
