'use client';

import { motion } from 'framer-motion';

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        textAlign: 'center',
        marginBottom: '2rem'
      }}
    >
      <h1 style={{ 
        color: 'var(--primary-color)',
        fontSize: '2.5rem',
        marginBottom: '0.5rem'
      }}>
        影视英语单词卡
      </h1>
      <p style={{ 
        color: 'var(--text-color)',
        fontSize: '1.2rem'
      }}>
        通过影视场景学习英语单词
      </p>
    </motion.header>
  );
};

export default Header; 