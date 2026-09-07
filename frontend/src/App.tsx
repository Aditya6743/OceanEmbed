import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import Explore from './pages/Explore';
import GradientWaves from './components/GradientWaves';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#030712] text-foreground flex flex-col font-sans relative">
        <div className="fixed inset-0 z-0 pointer-events-none flex flex-col">
          <div className="absolute inset-0">
            <GradientWaves 
                horizonColor="#020617"
                waveColor="#06b6d4"
                crestColor="#22d3ee"
                speed={0.4}
                amplitude={1.8}
                waveScale={0.8}
                tilt={1.2}
                zoom={1.0}
                height={4.0}
                fogDepth={15}
                brightness={0.7}
                opacity={0.8}
                mouseInteraction={false}
            />
          </div>
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
  );
}

export default App;
