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
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md shadow-lg border-b border-slate-800/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                TaskFlow
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-4"
            >
              {user ? (
                <Link
                  to="/dashboard"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-6 py-2 text-slate-300 font-semibold hover:text-white transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight"
            >
              Manage Your Tasks
              <br />
              <span className="text-indigo-400">
                Like a Pro
              </span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Streamline your workflow, boost productivity, and achieve your goals with our powerful task management system.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {user ? (
                <Link
                  to="/dashboard"
                  className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/25 transform hover:scale-105"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/25 transform hover:scale-105"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-4 bg-slate-800 text-slate-200 rounded-xl font-semibold text-lg hover:bg-slate-700 transition shadow-lg border border-slate-700"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>

          {/* Hero Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 relative"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 max-w-5xl mx-auto backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {['Urgent', 'High', 'Medium', 'Low'].map((priority, index) => (
                  <motion.div
                    key={priority}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className={`p-4 rounded-lg border-l-4 ${
                      priority === 'Urgent' ? 'border-red-500 bg-red-500/10' :
                      priority === 'High' ? 'border-orange-500 bg-orange-500/10' :
                      priority === 'Medium' ? 'border-blue-500 bg-blue-500/10' :
                      'border-emerald-500 bg-emerald-500/10'
                    }`}
                  >
                    <div className={`font-semibold mb-2 ${
                       priority === 'Urgent' ? 'text-red-400' :
                       priority === 'High' ? 'text-orange-400' :
                       priority === 'Medium' ? 'text-blue-400' :
                       'text-emerald-400'
                    }`}>{priority}</div>
                    <div className="text-sm text-slate-300">Sample Task</div>
                    <div className="text-xs text-slate-500 mt-2">Due: Today</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Powerful features designed to help you stay organized and productive
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-slate-800/50 p-6 rounded-xl shadow-lg hover:shadow-xl transition border border-slate-700/50 backdrop-blur-sm"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-indigo-900/20 border-y border-indigo-500/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          >
            {[
              { number: '10K+', label: 'Active Users' },
              { number: '1M+', label: 'Tasks Completed' },
              { number: '99.9%', label: 'Uptime' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-white"
              >
                <div className="text-5xl md:text-6xl font-bold mb-2 text-indigo-400">{stat.number}</div>
                <div className="text-xl opacity-90 text-slate-300">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-slate-400 mb-8">
              Join thousands of users who are already managing their tasks more efficiently
            </p>
            {user ? (
              <Link
                to="/dashboard"
                className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-500 transition shadow-xl shadow-indigo-500/20 transform hover:scale-105"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-500 transition shadow-xl shadow-indigo-500/20 transform hover:scale-105"
                >
                  Start Free Trial
                </Link>
                <Link
                  to="/login"
                  className="inline-block px-8 py-4 bg-slate-800 text-slate-200 rounded-xl font-semibold text-lg hover:bg-slate-700 transition shadow-lg border border-slate-700"
                >
                  Sign In
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;

