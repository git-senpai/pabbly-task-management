import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import KanbanBoard from './pages/KanbanBoard';
import TaskDetails from './pages/TaskDetails';
import Analytics from './pages/Analytics';
import Users from './pages/Users';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#000',
              border: '2px solid black',
              boxShadow: '4px 4px 0 0 #000',
              borderRadius: '0px',
              fontWeight: '900',
              textTransform: 'uppercase',
              padding: '12px 16px',
            },
            success: {
              duration: 3000,
              style: {
                background: '#10B981', // Bright Green
                color: '#000',
                border: '2px solid black',
              },
              iconTheme: {
                primary: '#000',
                secondary: '#10B981',
              },
            },
            error: {
              duration: 4000,
              style: {
                background: '#EF4444', // Bright Red
                color: '#fff',
                border: '2px solid black',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#EF4444',
              },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/board"
            element={
              <ProtectedRoute>
                <Layout>
                  <KanbanBoard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Layout>
                  <Analytics />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <TaskDetails />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <Users />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
