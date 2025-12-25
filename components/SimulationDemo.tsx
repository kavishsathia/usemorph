import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Terminal, Activity, Database } from "lucide-react";

const SimulationDemo: React.FC = () => {
  const [step, setStep] = useState(0);

  // Simulated conversation flow
  const conversation = [
    { type: "user", text: "Can you explain quantum superposition?" },
    {
      type: "ai",
      text: "Instead of explaining, let me show you. I'm setting up a double-slit experiment...",
    },
    { type: "system", text: "Building simulation..." },
    { type: "system", text: "Ready" },
    {
      type: "ai",
      text: "Try firing a single photon and observe where it lands. What do you notice?",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev < conversation.length ? prev + 1 : 0));
    }, 2500);
    return () => clearInterval(timer);
  }, [conversation.length]);

  return (
    <section className="w-full bg-morph-black py-24 border-b border-morph-border overflow-hidden">
      <div className="max-w-[90rem] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Left: Explanation */}
        <div className="p-12 border border-morph-border border-b-0 lg:border-b lg:border-r-0 bg-morph-black relative">
          <div className="absolute top-0 left-0 bg-morph-blue w-2 h-2"></div>
          <h3 className="font-display text-4xl text-morph-white mb-6 tracking-tighter">
            How it works
          </h3>
          <p className="text-morph-white/60 mb-8 max-w-md">
            Ask a question, and Morph builds an interactive simulation so you can explore the concept yourself rather than just reading about it.
          </p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-morph-blue uppercase">
              <Terminal size={14} />
              <span>Code Generation</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-morph-white/50 uppercase">
              <Activity size={14} />
              <span>Real-time Logic</span>
            </div>
          </div>
        </div>

        {/* Right: The UI Mockup */}
        <div className="bg-morph-panel border border-morph-border p-8 min-h-[500px] flex flex-col font-mono text-sm relative">
          {/* Mock Header */}
          <div className="flex justify-between items-center pb-4 border-b border-morph-border mb-4">
            <span className="text-morph-white/40">Physics Module</span>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/100 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col gap-4 overflow-hidden relative">
            <AnimatePresence mode="popLayout">
              {conversation.slice(0, step + 1).map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 border-l-2 max-w-[90%] ${
                    msg.type === "user"
                      ? "self-end border-morph-white bg-morph-white/5 text-right"
                      : msg.type === "system"
                      ? "border-transparent text-morph-blue font-bold text-xs"
                      : "self-start border-morph-blue bg-morph-blue/5"
                  }`}
                >
                  <span
                    className={`block text-xs mb-1 opacity-50 ${
                      msg.type === "user" ? "text-right" : ""
                    }`}
                  >
                    {msg.type === "user"
                      ? "You"
                      : msg.type === "system"
                      ? "System"
                      : "Morph"}
                  </span>
                  <p className="text-morph-white leading-relaxed">{msg.text}</p>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Gradient fade at bottom */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-morph-panel to-transparent pointer-events-none"></div>
          </div>

          {/* Input Area */}
          <div className="mt-4 pt-4 border-t border-morph-border flex gap-4 items-center opacity-50">
            <span className="text-morph-blue">{">"}</span>
            <div className="h-4 w-2 bg-morph-blue animate-pulse"></div>
            <span className="text-morph-white/30">Awaiting input...</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimulationDemo;
