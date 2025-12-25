import React from "react";
import { motion } from "framer-motion";

const modules = [
  {
    id: "01",
    title: "Physics Engine",
    tags: ["Gravity", "Velocity", "Collision"],
  },
  { id: "02", title: "Code Sandbox", tags: ["Python", "Rust", "Real-time"] },
  { id: "03", title: "History Diver", tags: ["Temporal", "Causality", "Maps"] },
  {
    id: "04",
    title: "Logic Gates",
    tags: ["Boolean", "Circuitry", "Hardware"],
  },
  { id: "05", title: "Bio-Lab", tags: ["Genetics", "Evolution", "Sim"] },
  { id: "06", title: "Econ-Model", tags: ["Market", "Game Theory", "Risk"] },
];

const ModuleGrid: React.FC = () => {
  return (
    <section id="modules" className="py-32 w-full bg-morph-black relative">
      <div className="max-w-[90rem] mx-auto px-6">
        <div className="mb-16">
          <h2 className="font-display text-4xl text-morph-white mb-4">
            AVAILABLE MODULES
          </h2>
          <div className="w-full h-px bg-morph-border"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-morph-border border border-morph-border">
          {modules.map((mod) => (
            <ModuleCard key={mod.id} {...mod} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface ModuleCardProps {
  id: string;
  title: string;
  tags: string[];
}

const ModuleCard: React.FC<ModuleCardProps> = ({ id, title, tags }) => {
  return (
    <motion.div
      whileHover={{ backgroundColor: "#121212" }}
      className="bg-morph-black p-8 min-h-[240px] flex flex-col justify-between group cursor-pointer transition-colors duration-300"
    >
      <div className="flex justify-between items-start">
        <span className="font-mono text-xs text-morph-blue/60 group-hover:text-morph-blue">
          SYS_MOD_{id}
        </span>
        <div className="w-2 h-2 rounded-full bg-morph-border group-hover:bg-morph-blue transition-colors duration-300"></div>
      </div>

      <div>
        <h3 className="font-display text-2xl text-morph-white mb-4 group-hover:translate-x-2 transition-transform duration-300">
          {title}
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs border border-morph-border px-2 py-1 text-morph-white/50 group-hover:border-morph-blue/30 group-hover:text-morph-blue/80 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ModuleGrid;
