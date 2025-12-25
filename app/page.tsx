"use client";

import Nav from "../components/Nav";
import Hero from "../components/Hero";
import Philosophy from "../components/Philosophy";
import SimulationDemo from "../components/SimulationDemo";
import ModuleGrid from "../components/ModuleGrid";
import Footer from "../components/Footer";
import NoiseOverlay from "../components/NoiseOverlay";

export default function Home() {
  return (
    <main className="bg-morph-black min-h-screen w-full relative selection:bg-morph-blue selection:text-white">
      <NoiseOverlay />
      <Nav />
      <Hero />
      <Philosophy />
      <SimulationDemo />
      <ModuleGrid />
      <Footer />
    </main>
  );
}
