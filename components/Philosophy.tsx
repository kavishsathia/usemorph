import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Pickaxe, Zap } from 'lucide-react';

const Philosophy: React.FC = () => {
  return (
    <section id="philosophy" className="py-32 w-full bg-morph-black border-b border-morph-border">
      <div className="max-w-[90rem] mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-5xl lg:text-7xl font-light tracking-tighter leading-none text-morph-white"
          >
            THE END OF <br/>
            <span className="text-morph-blue">PASSIVE CONSUMPTION</span>
          </motion.h2>
          
          <div className="flex flex-col justify-end">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-morph-white/70 max-w-xl leading-relaxed"
            >
              Most AI tutors just give you the answer. Morph guides you to find it yourself through questions and interactive simulations.
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-morph-border">
          <FeatureCard
            icon={<Brain className="w-8 h-8" />}
            title="Socratic Method"
            description="Instead of giving answers, Morph asks the right questions to help you think through problems step by step."
            index={1}
          />
          <FeatureCard
            icon={<Pickaxe className="w-8 h-8" />}
            title="Interactive Simulations"
            description="Explore concepts hands-on with custom-built tools and visualizations tailored to what you're learning."
            index={2}
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="Deeper Understanding"
            description="When you discover an answer yourself, you actually remember it. Morph makes sure learning sticks."
            index={3}
          />
        </div>

      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description, index }: { icon: React.ReactNode, title: string, description: string, index: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="border-r-0 md:border-r border-morph-border p-12 hover:bg-morph-panel transition-colors duration-500 group relative last:border-r-0"
  >
    <div className="absolute top-6 right-6 font-mono text-xs text-morph-white/20">0{index}</div>
    <div className="text-morph-blue mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
      {icon}
    </div>
    <h3 className="font-display text-2xl font-medium text-morph-white mb-4 tracking-tight">{title}</h3>
    <p className="text-morph-white/60 leading-relaxed text-sm">
      {description}
    </p>
  </motion.div>
);

export default Philosophy;