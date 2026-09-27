import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import Explore from './pages/Explore';
import Solutions from './pages/Solutions';
import Architecture from './pages/Architecture';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import GradientWaves from './components/GradientWaves';
import MobileWarningOverlay from './components/MobileWarningOverlay';

function App() {
  const [appReady, setAppReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <Router>
      {!appReady && <Preloader onComplete={() => setAppReady(true)} />}
      {!isMobile && <CustomCursor />}
      <MobileWarningOverlay />
      
      <div className="min-h-screen bg-[#030712] text-foreground flex flex-col font-sans relative">
        <div className="fixed inset-0 z-0 pointer-events-none flex flex-col">
          {!isMobile ? (
            <div className="absolute inset-0">
              <GradientWaves 
                  horizonColor="#020617"
                  waveColor="#0891b2"
                  crestColor="#22d3ee"
                  speed={0.6}
                  amplitude={2.1}
                  waveScale={1.0}
                  tilt={1.1}
                  zoom={1.2}
                  height={4.5}
                  fogDepth={18}
                  brightness={0.8}
                  opacity={1.0}
                  mouseInteraction={false}
                  detail="low"
              />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#082f49] to-[#030712] opacity-40"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-20"></div>
        </div>
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/architecture" element={<Architecture />} />
              <Route path="/solutions" element={<Solutions />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
