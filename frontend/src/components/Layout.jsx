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
    <div className="min-h-screen bg-[#FFFDF5] text-black font-mono">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b-2 border-black shadow-[0_4px_0_0_#000000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center group">
                <span className="text-2xl font-black italic tracking-widest text-[#8B5CF6] border-2 border-black bg-white px-2 py-1 transform -rotate-2 group-hover:rotate-0 transition-transform shadow-[2px_2px_0_0_#000]">TaskFlow</span>
              </Link>
              
              <div className="flex space-x-4">
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 font-black uppercase text-sm border-2 border-black transition-all duration-200 ${
                    isActive('/dashboard')
                      ? 'bg-[#8B5CF6] text-white shadow-[4px_4px_0_0_#000] translate-x-[-2px] translate-y-[-2px]'
                      : 'bg-white text-black hover:bg-gray-50 hover:shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/board"
                  className={`px-4 py-2 font-black uppercase text-sm border-2 border-black transition-all duration-200 ${
                    isActive('/board')
                      ? 'bg-[#F472B6] text-white shadow-[4px_4px_0_0_#000] translate-x-[-2px] translate-y-[-2px]'
                      : 'bg-white text-black hover:bg-gray-50 hover:shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                  }`}
                >
                  Priority Board
                </Link>
                <Link
                  to="/analytics"
                  className={`px-4 py-2 font-black uppercase text-sm border-2 border-black transition-all duration-200 ${
                    isActive('/analytics')
                      ? 'bg-[#FBBF24] text-black shadow-[4px_4px_0_0_#000] translate-x-[-2px] translate-y-[-2px]'
                      : 'bg-white text-black hover:bg-gray-50 hover:shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                  }`}
                >
                  Analytics
                </Link>
                {isAdmin() && (
                  <Link
                    to="/users"
                    className={`px-4 py-2 font-black uppercase text-sm border-2 border-black transition-all duration-200 ${
                      isActive('/users')
                        ? 'bg-[#A7F3D0] text-black shadow-[4px_4px_0_0_#000] translate-x-[-2px] translate-y-[-2px]'
                        : 'bg-white text-black hover:bg-gray-50 hover:shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                    }`}
                  >
                    Users
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3 bg-white py-1.5 px-4 border-2 border-black shadow-[4px_4px_0_0_#000]">
                <div className="text-right leading-tight">
                  <p className="text-sm font-black text-black uppercase">{user?.name}</p>
                  <p className="text-xs text-gray-500 font-bold">{user?.email}</p>
                </div>
                {isAdmin() && (
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-[#C4B5FD] text-black border-2 border-black">
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-black uppercase text-white bg-[#EF4444] border-2 border-black shadow-[4px_4px_0_0_#000] hover:bg-red-600 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0_0_#000] transition-all"
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

