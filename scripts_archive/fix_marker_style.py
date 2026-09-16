import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

old_marker_meshes = """          {/* Tactical Crosshair - GUARANTEED VISIBLE */}
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
          </mesh>"""

new_marker_meshes = """          {/* Simple Clean Dot Marker (Matches Home Page) */}
          <mesh renderOrder={999}>
            <sphereGeometry args={[0.015, 16, 16]} />
            <meshBasicMaterial color="#22d3ee" depthTest={false} />
          </mesh>
          <mesh renderOrder={999}>
            <sphereGeometry args={[0.035, 16, 16]} />
            <meshBasicMaterial color="#22d3ee" transparent opacity={0.3} depthTest={false} />
          </mesh>"""

code = code.replace(old_marker_meshes, new_marker_meshes)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
print("Updated marker style.")
