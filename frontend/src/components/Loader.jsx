import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px] w-full">
      <div className="relative w-24 h-24">
        <motion.div
          className="absolute inset-0 border-4 border-indigo-500/30 rounded-full"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-2 border-4 border-t-indigo-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-6 border-4 border-t-transparent border-r-indigo-400 border-b-transparent border-l-purple-400 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-500 rounded-full blur-[2px]"
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
    </div>
  );
};

export default Loader;
