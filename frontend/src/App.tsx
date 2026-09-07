import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import Explore from './pages/Explore';
import GradientWaves from './components/GradientWaves';
import Preloader from './components/Preloader';

function App() {
  const [appReady, setAppReady] = useState(false);

  return (
    <ReactLenis root options={{ lerp: 0.04, duration: 1.8, smoothWheel: true }}>
      <Router>
      {!appReady && <Preloader onComplete={() => setAppReady(true)} />}

      <div className="min-h-screen bg-[#030712] text-foreground flex flex-col font-sans relative">
        <div className="fixed inset-0 z-0 pointer-events-none flex flex-col">
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
            />
          </div>
          {/* Subtle Dark Overlay to ensure waves do not overpower content */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-80"></div>
          
          {/* Premium Neon Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>
        </div>
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/explore" element={<Explore />} />
            </Routes>
          </main>
        </div>
      </div>
      </Router>
    </ReactLenis>
  );
}

export default App;
