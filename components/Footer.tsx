import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer id="access" className="bg-morph-black pt-32 pb-12 border-t border-morph-border">
      <div className="max-w-[90rem] mx-auto px-6 flex flex-col md:flex-row justify-between items-end">
        
        <div className="mb-12 md:mb-0">
          <h1 className="font-display text-[15vw] leading-[0.75] text-morph-white tracking-tighter opacity-10 hover:opacity-100 transition-opacity duration-700 cursor-default select-none">
            MORPH
          </h1>
        </div>

        <div className="flex flex-col gap-6 text-right">
          <div className="flex gap-8 text-sm font-mono text-morph-white/60">
            <a href="#" className="hover:text-morph-blue transition-colors">TWITTER</a>
            <a href="#" className="hover:text-morph-blue transition-colors">GITHUB</a>
            <a href="#" className="hover:text-morph-blue transition-colors">DISCORD</a>
          </div>
          <p className="text-morph-white/30 text-xs max-w-xs ml-auto">
            © 2025 Morph. <br/>
            Learn by doing, not by reading.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;