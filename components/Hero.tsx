import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={containerRef} className="relative h-screen w-full flex flex-col justify-center items-center lg:items-start overflow-hidden border-b border-morph-border">
      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 w-full max-w-[90rem] mx-auto px-6 grid grid-cols-4 gap-0"
      >
        <div className="col-span-4 lg:col-span-3">
          <motion.h1 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[12vw] leading-[0.85] font-medium tracking-tighter text-morph-white mix-blend-exclusion"
          >
            LEARN <br />
            THROUGH <br />
            <span className="text-morph-blue">CHAOS</span>
          </motion.h1>
        </div>

        <div className="col-span-4 lg:col-span-1 flex flex-col justify-end pb-4 pl-0 lg:pl-8 mt-16 lg:mt-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="space-y-8"
          >
            <p className="text-morph-white/80 text-lg leading-relaxed text-balance">
              Morph is an AI tutor that doesn't give you answers. It asks questions, builds simulations, and guides you to discover concepts yourself.
            </p>

            <Link href="/login" className="inline-block bg-morph-white text-morph-black px-8 py-4 font-display font-bold text-lg tracking-tight hover:bg-morph-blue hover:text-white transition-colors duration-300">
              Get access
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative localized data points */}
      <div className="absolute bottom-6 left-6 font-mono text-xs text-morph-white/30">
        LAT: 34.0522 N <br/> LON: 118.2437 W
      </div>
    </section>
  );
};

export default Hero;