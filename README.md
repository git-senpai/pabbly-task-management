# Task Management System - MERN Stack

A modern, production-ready Task Management System built with MongoDB, Express.js, React.js, and Node.js.

## 🚀 Features

### Core Functionality
- ✅ **Task Creation** - Create tasks with title, description, due date, priority, and assigned user
- ✅ **Task Listing** - Server-side pagination with AJAX-based fetching
- ✅ **Task Details** - Dedicated page with full task information and status timeline
- ✅ **Task Editing** - Update task details with form validation
- ✅ **Task Deletion** - Soft delete with confirmation modal
- ✅ **Status Management** - Change status (Pending → In Progress → Completed) with quick toggle
- ✅ **Priority Management** - Color-coded priority system (Low/Medium/High/Urgent)
- ✅ **User Authentication** - JWT-based authentication with password hashing
- ✅ **Role-based Access** - Admin and User roles with appropriate permissions
- ✅ **Advanced Filtering** - Filter by priority, status, and due date range
- ✅ **Sorting** - Sort by latest, due date, or priority
- ✅ **User Management** - Admin can add/remove users and assign tasks

### UI/UX Features
- 🎨 Modern, responsive design with Tailwind CSS
- 🎯 Color-coded priority visualization
- 🔔 Toast notifications for all actions
- 📱 Mobile-friendly responsive layout
- ⚡ Fast and smooth user experience
- 🎭 Beautiful modals and forms

## 📁 Project Structure

```
pabbly/
├── backend/
│   ├── models/
│   │   ├── User.model.js
│   │   └── Task.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── task.routes.js
│   │   └── user.routes.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v20+ recommended)
- MongoDB (running locally or connection string)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update MongoDB URI and JWT secret

4. Start MongoDB (if running locally)

5. Run the server:
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (optional):
   - Create `.env` file
   - Set `VITE_API_URL=http://localhost:5000/api`

4. Run the development server:
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173` (or similar)

## 🎨 Color Scheme

- **Low Priority**: 🟢 Green
- **Medium Priority**: 🔵 Blue
- **High Priority**: 🟠 Orange
- **Urgent Priority**: 🔴 Red

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks` - Get all tasks (with pagination, filtering, sorting)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/status` - Update task status
- `DELETE /api/tasks/:id` - Delete task (soft delete)

### Users (Admin Only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `DELETE /api/users/:id` - Delete user

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes (frontend & backend)
- Role-based access control
- Input validation and sanitization
- Soft delete for data recovery

## 🧪 Testing the Application

1. **Register a new user** or login
2. **Create tasks** with different priorities
3. **Filter and sort** tasks
4. **Update task status** using the dropdown
5. **View task details** by clicking on task title
6. **Edit or delete** tasks
7. **As Admin**: Manage users from the Users page

## 📝 Default Admin Account

To create an admin account, register a user and update the role in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## 🚀 Production Deployment

1. Set `NODE_ENV=production` in backend `.env`
2. Use a strong `JWT_SECRET`
3. Configure MongoDB Atlas or production database
4. Build frontend: `npm run build`
5. Serve frontend build files with a web server
6. Configure CORS for production domain

## 📦 Technologies Used

### Backend
- Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-validator
- CORS

### Frontend
- React 19
- React Router DOM
- Axios
- React Hot Toast
- Tailwind CSS
- Vite
- date-fns

## 📄 License

This project is created for internship/portfolio purposes.

## 👨‍💻 Author

Built with ❤️ using the MERN stack

