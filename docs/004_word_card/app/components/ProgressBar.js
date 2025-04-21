'use client';

import { motion } from 'framer-motion';

const ProgressBar = ({ progress }) => {
  return (
    <div className="progress-bar">
      <motion.div 
        className="progress"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
};

export default ProgressBar; 