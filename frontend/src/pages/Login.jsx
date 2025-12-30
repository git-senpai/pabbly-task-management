import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF5] px-4 relative overflow-hidden">
      {/* Neo Background Pattern */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      
      <div className="max-w-md w-full bg-white border-2 border-black shadow-[8px_8px_0_0_#000] p-8 relative z-10 transition-transform hover:translate-x-[-2px] hover:translate-y-[-2px]">
        <div className="text-center mb-8 border-b-2 border-black pb-4">
          <h1 className="text-4xl font-black italic text-black mb-2 uppercase tracking-tighter drop-shadow-[2px_2px_0_#fff]">Welcome Back</h1>
          <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-black text-black mb-2 uppercase">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border-2 border-black text-black focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-all placeholder-gray-400 font-bold rounded-none"
              placeholder="YOU@EXAMPLE.COM"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-black text-black mb-2 uppercase">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border-2 border-black text-black focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-all placeholder-gray-400 font-bold rounded-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8B5CF6] text-white py-3 font-black uppercase tracking-wider border-2 border-black hover:bg-[#7C3AED] hover:shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all active:translate-x-0 active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
          >
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 font-bold">
          DON'T HAVE AN ACCOUNT?{' '}
          <Link to="/register" className="text-[#8B5CF6] font-black hover:text-[#7C3AED] underline decoration-2 underline-offset-4 uppercase">
            SIGN UP
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

