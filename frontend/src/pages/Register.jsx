import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    const result = await register(formData.name, formData.email, formData.password);
    
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
      <div className="absolute -bottom-32 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

      <div className="max-w-md w-full bg-white border-2 border-black shadow-[8px_8px_0_0_#000] p-8 relative z-10 transition-transform hover:translate-x-[-2px] hover:translate-y-[-2px]">
        <div className="text-center mb-8 border-b-2 border-black pb-4">
          <h1 className="text-4xl font-black italic text-black mb-2 uppercase tracking-tighter drop-shadow-[2px_2px_0_#fff]">Join the Squad</h1>
          <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">Sign up to get started</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border-2 border-red-500 text-red-600 font-black text-sm uppercase text-center shadow-[4px_4px_0_0_#ef4444]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-black text-black mb-2 uppercase">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border-2 border-black text-black focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-all placeholder-gray-400 font-bold rounded-none"
              placeholder="YOUR NAME"
            />
          </div>

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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-black text-black mb-2 uppercase">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border-2 border-black text-black focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-all placeholder-gray-400 font-bold rounded-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#10B981] text-black py-3 font-black uppercase tracking-wider border-2 border-black hover:bg-[#059669] hover:text-white hover:shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all active:translate-x-0 active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
          >
            {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 font-bold">
          ALREADY HAVE AN ACCOUNT?{' '}
          <Link to="/login" className="text-[#8B5CF6] font-black hover:text-[#7C3AED] underline decoration-2 underline-offset-4 uppercase">
            SIGN IN
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

