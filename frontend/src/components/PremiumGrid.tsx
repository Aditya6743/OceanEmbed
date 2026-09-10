import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function PremiumGrid() {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const springX = useSpring(mouseX, { stiffness: 500, damping: 50 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      
      {/* Extremely visible grid for debugging */}
      <div 
        className="absolute inset-0 opacity-100 mix-blend-screen"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 229, 255, 0.4) 2px, transparent 2px),
            linear-gradient(to bottom, rgba(0, 229, 255, 0.4) 2px, transparent 2px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
      
      {/* 3) Extremely bright flashlight orb following the cursor */}
      <motion.div
        className="absolute top-0 left-0 w-[400px] h-[400px] -ml-[200px] -mt-[200px] rounded-full bg-cyan-400 blur-[40px] mix-blend-screen pointer-events-none"
        style={{
          x: springX,
          y: springY
        }}
      />

    </div>
  );
}
