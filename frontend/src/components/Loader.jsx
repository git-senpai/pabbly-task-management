import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="flex items-center justify-center p-8 w-full h-64">
      <div className="relative w-24 h-24">
        {/* Outer rotating square */}
        <motion.div
          className="absolute inset-0 border-4 border-black bg-[#FBBF24]"
          animate={{
            rotate: 360,
            borderRadius: ["0%", "50%", "0%"],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />
        
        {/* Inner pulsing circle */}
        <motion.div
          className="absolute inset-4 bg-[#8B5CF6] border-4 border-black"
          animate={{
            scale: [0.8, 1.2, 0.8],
            rotate: -180,
            borderRadius: ["50%", "20%", "50%"],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />
        
        {/* Center dot */}
        <motion.div
          className="absolute inset-[38%] bg-black"
          animate={{
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 1,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      </div>
    </div>
  );
};

export default Loader;
