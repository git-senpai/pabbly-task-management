import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

const Landing = () => {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const features = [
    {
      icon: '📋',
      title: 'Task Management',
      description: 'Create, organize, and track all your tasks in one place with ease.',
    },
    {
      icon: '🎯',
      title: 'Priority System',
      description: 'Color-coded priorities help you focus on what matters most.',
    },
    {
      icon: '👥',
      title: 'Team Collaboration',
      description: 'Assign tasks to team members and track progress together.',
    },
    {
      icon: '📊',
      title: 'Advanced Analytics',
      description: 'Filter, sort, and analyze your tasks with powerful tools.',
    },
    {
      icon: '🔔',
      title: 'Real-time Updates',
      description: 'Get instant notifications and updates on your tasks.',
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-black selection:bg-yellow-300 selection:text-black font-mono">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b-2 border-black z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="text-3xl font-black italic tracking-tighter uppercase bg-yellow-300 border-2 border-black px-2 shadow-[4px_4px_0_0_#000] hover:-translate-y-1 transition-transform">
              TaskFlow
            </Link>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="neo-btn bg-[#8B5CF6] text-white hover:bg-[#7C3AED] px-8"
                >
                  DASHBOARD
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="font-bold hover:underline decoration-2 underline-offset-4 uppercase"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="neo-btn bg-[#FBBF24] text-black hover:bg-[#F59E0B]"
                  >
                    GET STARTED
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b-2 border-black">
        <div className="absolute top-20 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-20 left-0 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black mb-6 uppercase tracking-tighter leading-none"
          >
            Manage Tasks
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 drop-shadow-[4px_4px_0_#000]">
              LIKE A BOSS
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl font-bold text-slate-700 mb-10 max-w-3xl mx-auto border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]"
          >
            Stop drowning in chaos. Organize your life with the most stylish task manager on the web.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link
              to={user ? "/dashboard" : "/register"}
              className="px-8 py-4 bg-[#FF6B6B] text-black font-black text-xl border-2 border-black shadow-[8px_8px_0_0_#000] hover:shadow-[12px_12px_0_0_#000] hover:-translate-y-1 transition-all uppercase"
            >
              {user ? "Go to Dashboard" : "Start For Free"}
            </Link>
            {!user && (
              <Link
                to="/login"
                className="px-8 py-4 bg-white text-black font-black text-xl border-2 border-black shadow-[8px_8px_0_0_#000] hover:shadow-[12px_12px_0_0_#000] hover:-translate-y-1 transition-all uppercase"
              >
                Log In
              </Link>
            )}
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-20 relative max-w-5xl mx-auto"
          >
            <div className="bg-white border-2 border-black p-8 shadow-[12px_12px_0_0_#000]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'HIGH', color: 'bg-[#EF4444]', text: 'text-white' },
                  { label: 'MEDIUM', color: 'bg-[#3B82F6]', text: 'text-white' },
                  { label: 'LOW', color: 'bg-[#10B981]', text: 'text-black' }
                ].map((item, index) => (
                  <div key={item.label} className={`${item.color} border-2 border-black p-4 shadow-[4px_4px_0_0_#000] transform hover:-rotate-2 transition-transform`}>
                    <div className={`font-black text-lg ${item.text}`}>{item.label}</div>
                    <div className={`text-sm font-bold opacity-90 ${item.text}`}>Task #{index + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#A7F3D0] border-b-2 border-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-black mb-4 uppercase drop-shadow-[4px_4px_0_#fff]">
              Why Use TaskFlow?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02, rotate: 1 }}
                className="bg-white p-8 border-2 border-black shadow-[8px_8px_0_0_#000]"
              >
                <div className="text-5xl mb-6 bg-yellow-300 w-16 h-16 flex items-center justify-center border-2 border-black rounded-full shadow-[2px_2px_0_0_#000]">{feature.icon}</div>
                <h3 className="text-2xl font-black text-black mb-3 uppercase">{feature.title}</h3>
                <p className="text-black font-bold text-lg">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FDE047] border-b-2 border-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { number: '10K+', label: 'Active Users' },
              { number: '1M+', label: 'Tasks Done' },
              { number: '100%', label: 'Productivity' },
            ].map((stat, index) => (
              <div key={index} className="bg-white border-2 border-black p-8 shadow-[8px_8px_0_0_#000] transform hover:-translate-y-2 transition-transform">
                <div className="text-6xl font-black mb-2 text-black tracking-tighter">{stat.number}</div>
                <div className="text-xl font-bold uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-black mb-8 uppercase text-[#FF6B6B]">
            Stop Procrastinating
          </h2>
          <p className="text-2xl font-bold mb-12">
            Join the revolution of organized chaos.
          </p>
          <Link
            to={user ? "/dashboard" : "/register"}
            className="inline-block px-10 py-5 bg-[#C4B5FD] text-black font-black text-2xl border-2 border-white shadow-[8px_8px_0_0_#fff] hover:shadow-[12px_12px_0_0_#fff] hover:-translate-y-1 transition-all uppercase"
          >
            {user ? "Go to Dashboard" : "Start Now"}
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <div className="bg-white border-t-2 border-black p-8 text-center font-bold">
        <p>© 2024 TaskFlow. Built for style.</p>
      </div>
    </div>
  );
};

export default Landing;

