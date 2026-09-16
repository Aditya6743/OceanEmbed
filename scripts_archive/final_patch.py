import re

with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

# 1. Add Radio to imports
code = code.replace(
    "Activity} from 'lucide-react';",
    "Activity, Radio} from 'lucide-react';"
)

# 2. Fix JSX inside newLogs string array
code = code.replace(
    '"> WARNING: TCHP Energy {">"} 140 kJ/cm² Detected",',
    '"> WARNING: TCHP Energy > 140 kJ/cm² Detected",'
)

# 3. Inject IotHubDashboard render
canvas_block = """        <Canvas className="w-full h-full" camera={{ position: [0, 0, 5.35], fov: 45 }} dpr={[1, 2]} performance={{ min: 0.5 }}>
            <Suspense fallback={null}>
            <CameraResetTrigger activeTab={activeTab} isRotationLocked={isRotationLocked} />
            <RotationController isRotationLocked={isRotationLocked} />
            <MosdacGlobe viewMode={activeTab} isRotationLocked={isRotationLocked} />
            <OrbitControls makeDefault 
                enablePan={false} enableDamping={true} dampingFactor={0.03} rotateSpeed={0.4}
                enableZoom={true} minDistance={4.3} maxDistance={5.35} 
                autoRotate={!isRotationLocked} autoRotateSpeed={0.3}
            />
            </Suspense>
        </Canvas>"""

replacement_canvas = """        {activeTab !== 'iot' && (
        <Canvas className="w-full h-full" camera={{ position: [0, 0, 5.35], fov: 45 }} dpr={[1, 2]} performance={{ min: 0.5 }}>
            <Suspense fallback={null}>
            <CameraResetTrigger activeTab={activeTab} isRotationLocked={isRotationLocked} />
            <RotationController isRotationLocked={isRotationLocked} />
            <MosdacGlobe viewMode={activeTab as any} isRotationLocked={isRotationLocked} />
            <OrbitControls makeDefault 
                enablePan={false} enableDamping={true} dampingFactor={0.03} rotateSpeed={0.4}
                enableZoom={true} minDistance={4.3} maxDistance={5.35} 
                autoRotate={!isRotationLocked} autoRotateSpeed={0.3}
            />
            </Suspense>
        </Canvas>
        )}
        {activeTab === 'iot' && (
          <div className="absolute inset-0 z-0 pl-[35%] pt-20 bg-[#030712] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e908_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e908_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
            <IotHubDashboard />
          </div>
        )}"""

code = code.replace(canvas_block, replacement_canvas)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
