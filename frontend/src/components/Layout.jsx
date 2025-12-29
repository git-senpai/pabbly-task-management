import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center group">
                <span className="text-2xl font-bold text-indigo-500 group-hover:text-indigo-400 transition-colors">TaskFlow</span>
              </Link>
              
              <div className="flex space-x-1">
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/dashboard')
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                  }`}
                >
                  Dashboard
                </Link>
                {isAdmin() && (
                  <Link
                    to="/users"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive('/users')
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                    }`}
                  >
                    Users
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-slate-800/50 py-1.5 px-3 rounded-full border border-slate-700/50">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-200">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                {isAdmin() && (
                  <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20">
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/50 hover:shadow-red-500/20 border border-transparent rounded-lg transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;

