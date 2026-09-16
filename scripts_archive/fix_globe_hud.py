import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

# 1. Restrict clicks to the requested bounding box
old_handler = """  const handleGlobeClick = useCallback((e: any) => {
    e.stopPropagation();
    const p = e.point.clone().normalize();
    const lat = Math.asin(p.y) * (180 / Math.PI);
    const lon = Math.atan2(-p.z, p.x) * (180 / Math.PI);
    
    const seed = Math.abs(Math.sin(lat * 12.9898 + lon * 78.233)) * 43758.5453;"""

new_handler = """  const handleGlobeClick = useCallback((e: any) => {
    e.stopPropagation();
    const p = e.point.clone().normalize();
    const lat = Math.asin(p.y) * (180 / Math.PI);
    const lon = Math.atan2(-p.z, p.x) * (180 / Math.PI);
    
    // STRICT BOUNDING BOX: Only allow clicks within the Indian Ocean (Lat 5 to 30, Lon 45 to 105)
    if (lat < 5.0 || lat > 30.0 || lon < 45.0 || lon > 105.0) {
        setActivePin(null);
        return;
    }
    
    const seed = Math.abs(Math.sin(lat * 12.9898 + lon * 78.233)) * 43758.5453;"""

code = code.replace(old_handler, new_handler)

# 2. Fix the marker visibility (larger point, depthTest disabled) and tooltip alignment
old_marker = """      {/* HUD MARKER OVERLAY */}
      {activePin && (
        <group position={activePin.point}>
          {/* Tactical Crosshair */}
          <mesh>
            <sphereGeometry args={[0.015, 16, 16]} />
            <meshBasicMaterial color="#06b6d4" />
          </mesh>
          <mesh rotation={[Math.PI/2, 0, 0]}>
            <ringGeometry args={[0.025, 0.035, 32]} />
            <meshBasicMaterial color="#06b6d4" side={THREE.DoubleSide} transparent opacity={0.8} />
          </mesh>
          <mesh rotation={[0, Math.PI/2, 0]}>
            <ringGeometry args={[0.025, 0.035, 32]} />
            <meshBasicMaterial color="#06b6d4" side={THREE.DoubleSide} transparent opacity={0.4} />
          </mesh>
          
          {/* Holographic Tooltip */}
          <Html center distanceFactor={4}>
            <div className="flex flex-col bg-slate-950/90 border border-cyan-500/50 rounded-lg p-3 w-56 backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.3)] pointer-events-none transform -translate-y-24">"""

new_marker = """      {/* HUD MARKER OVERLAY */}
      {activePin && (
        <group position={activePin.point}>
          {/* Tactical Crosshair - GUARANTEED VISIBLE */}
          <mesh renderOrder={999}>
            <sphereGeometry args={[0.025, 16, 16]} />
            <meshBasicMaterial color="#22d3ee" depthTest={false} />
          </mesh>
          <mesh rotation={[Math.PI/2, 0, 0]} renderOrder={999}>
            <ringGeometry args={[0.04, 0.05, 32]} />
            <meshBasicMaterial color="#22d3ee" side={THREE.DoubleSide} transparent opacity={0.9} depthTest={false} />
          </mesh>
          <mesh rotation={[0, Math.PI/2, 0]} renderOrder={999}>
            <ringGeometry args={[0.04, 0.05, 32]} />
            <meshBasicMaterial color="#22d3ee" side={THREE.DoubleSide} transparent opacity={0.5} depthTest={false} />
          </mesh>
          
          {/* Holographic Tooltip - FIXED ALIGNMENT */}
          <Html style={{ pointerEvents: 'none', transform: 'translate3d(20px, -20px, 0)' }}>
            <div className="flex flex-col bg-slate-950/95 border border-cyan-500/80 rounded-lg p-3 w-56 backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.5)] pointer-events-none">"""

code = code.replace(old_marker, new_marker)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
print("Globe HUD fixes applied.")
