# Task Management System - Frontend

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Update `VITE_API_URL` if your backend is running on a different port

3. **Run the Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Features

✅ Modern, responsive UI with Tailwind CSS
✅ User Authentication (Login/Register)
✅ Task Management (Create, Read, Update, Delete)
✅ Priority-based Task Organization (Color-coded)
✅ Status Management (Pending → In Progress → Completed)
✅ Server-side Pagination
✅ Advanced Filtering (Priority, Status, Date Range)
✅ Sorting (Latest, Due Date, Priority)
✅ Task Details Page with Status Timeline
✅ User Management (Admin only)
✅ Toast Notifications
✅ Protected Routes
✅ Role-based Access Control

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── TaskCard.jsx
│   │   ├── TaskModal.jsx
│   │   └── DeleteModal.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── TaskDetails.jsx
│   │   └── Users.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
└── vite.config.js
```

## Color Scheme

- **Low Priority**: Green
- **Medium Priority**: Blue
- **High Priority**: Orange
- **Urgent Priority**: Red

## Tech Stack

- React 19
- React Router DOM
- Axios
- React Hot Toast
- Tailwind CSS
- Vite
- date-fns
