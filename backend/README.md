# Task Management System - Backend API

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Update the following variables:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/taskmanagement
     JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
     JWT_EXPIRE=7d
     NODE_ENV=development
     ```

3. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - Default connection: `mongodb://localhost:27017/taskmanagement`

4. **Run the Server**
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Task Routes (`/api/tasks`)
- `GET /api/tasks` - Get all tasks (with pagination, filtering, sorting)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `PATCH /api/tasks/:id/status` - Update task status
- `DELETE /api/tasks/:id` - Delete a task (soft delete)

### User Routes (`/api/users`) - Admin Only
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `DELETE /api/users/:id` - Delete a user (soft delete)

## Features Implemented

✅ JWT Authentication & Authorization
✅ Role-based Access Control (Admin/User)
✅ Task CRUD Operations
✅ Server-side Pagination
✅ Filtering (Priority, Status, Due Date Range)
✅ Sorting (Latest, Due Date, Priority)
✅ Soft Delete for Tasks and Users
✅ Status History Tracking
✅ Password Hashing with bcrypt
✅ Input Validation with express-validator

## Project Structure

```
backend/
├── models/
│   ├── User.model.js
│   └── Task.model.js
├── routes/
│   ├── auth.routes.js
│   ├── task.routes.js
│   └── user.routes.js
├── middleware/
│   └── auth.middleware.js
├── utils/
│   └── generateToken.js
├── server.js
├── package.json
└── .env
```

