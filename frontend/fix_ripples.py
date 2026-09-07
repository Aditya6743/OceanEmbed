with open("src/components/Preloader.tsx", "r") as f:
    content = f.read()

# Replace the giant ripple DOM elements
old_dom = """          <>
            <div className="absolute top-[40%] left-1/2 w-[1000px] h-[1000px] premium-flash"></div>
            <div className="absolute top-[40%] left-1/2 w-[150vw] h-[150vw] max-w-[2000px] max-h-[2000px] premium-ripple-1"></div>
            <div className="absolute top-[40%] left-1/2 w-[180vw] h-[180vw] max-w-[2400px] max-h-[2400px] premium-ripple-2"></div>
          </>"""

new_dom = """          <>
            <div className="absolute top-[40%] left-1/2 w-[600px] h-[600px] premium-flash"></div>
            <div className="absolute top-[40%] left-1/2 w-[600px] h-[600px] premium-ripple"></div>
          </>"""

content = content.replace(old_dom, new_dom)

# Replace the giant ripple CSS
old_css = """        /* PREMIUM SHOCKWAVE ANIMATIONS */
        .premium-flash {
          background: radial-gradient(circle at center, rgba(255,255,255,1) 0%, rgba(34,211,238,0.5) 20%, transparent 60%);
          animation: flash-anim 0.8s ease-out forwards;
        }
        .premium-ripple-1 {
          border-radius: 50%;
          border: 4px solid rgba(255,255,255,0.9);
          backdrop-filter: blur(10px) brightness(1.2);
          box-shadow: inset 0 0 100px rgba(34,211,238,0.9), 0 0 100px rgba(34,211,238,0.9);
          animation: ripple-anim-1 1s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }
        .premium-ripple-2 {
          border-radius: 50%;
          border-top: 8px solid #22d3ee;
          border-bottom: 8px solid #22d3ee;
          mix-blend-mode: screen;
          animation: ripple-anim-2 1.2s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }

        @keyframes flash-anim {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          10% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
        @keyframes ripple-anim-1 {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; border-width: 80px; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0; border-width: 1px; }
        }
        @keyframes ripple-anim-2 {
          0% { transform: translate(-50%, -50%) scale(0) rotate(-45deg); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1) rotate(45deg); opacity: 0; }
        }"""

new_css = """        /* SUBTLE SHOCKWAVE ANIMATIONS */
        .premium-flash {
          background: radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(34,211,238,0.3) 30%, transparent 60%);
          animation: flash-anim 0.6s ease-out forwards;
        }
        .premium-ripple {
          border-radius: 50%;
          border: 2px solid rgba(34,211,238,0.8);
          backdrop-filter: blur(4px);
          box-shadow: 0 0 30px rgba(34,211,238,0.4) inset;
          animation: ripple-anim 0.8s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }

        @keyframes flash-anim {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
          20% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
        @keyframes ripple-anim {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; border-width: 15px; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0; border-width: 1px; }
        }"""

content = content.replace(old_css, new_css)

with open("src/components/Preloader.tsx", "w") as f:
    f.write(content)
