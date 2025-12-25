import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Nav: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-40 px-6 py-6 flex justify-between items-center mix-blend-difference text-morph-white">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="font-display font-bold text-xl tracking-tighter"
      >
        MORPH
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex gap-8 text-sm font-medium tracking-tight"
      >
        <a href="#philosophy" className="hover:text-morph-blue transition-colors duration-300">About</a>
        <a href="#modules" className="hover:text-morph-blue transition-colors duration-300">Modules</a>
        <span className="opacity-30">/</span>
        <Link href="/login" className="hover:text-morph-blue transition-colors duration-300">Login</Link>
      </motion.div>
    </nav>
  );
};

export default Nav;