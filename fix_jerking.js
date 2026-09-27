const fs = require('fs');
let file = 'frontend/src/pages/Solutions.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldFuncStart = `function CameraResetTrigger({ activeTab, climateMode: _c, isRotationLocked, recenterTrigger }: { activeTab: string, climateMode: string, isRotationLocked: boolean, recenterTrigger?: number }) {`;
const oldFuncEnd = `    return null;
}
`;

const oldFunc = content.substring(content.indexOf(oldFuncStart), content.indexOf(oldFuncEnd) + oldFuncEnd.length);

const newFunc = `function CameraResetTrigger({ activeTab, climateMode: _c, isRotationLocked, recenterTrigger }: { activeTab: string, climateMode: string, isRotationLocked: boolean, recenterTrigger?: number }) {
    const { camera, controls } = useThree();
    const [isAnimating, setIsAnimating] = useState(false);
    const animRef = useRef({ startAzimuth: 0, targetAzimuth: 0, startPolar: 0, targetPolar: 0, startDist: 5.35, targetDist: 5.35, progress: 0 });
    
    useEffect(() => {
        if (!controls) return;
        
        let startAzimuth = (controls as any).getAzimuthalAngle();
        startAzimuth = startAzimuth % (2 * Math.PI);
        if (startAzimuth > Math.PI) startAzimuth -= 2 * Math.PI;
        if (startAzimuth < -Math.PI) startAzimuth += 2 * Math.PI;
        
        let startPolar = (controls as any).getPolarAngle();
        let startDist = (controls as any).getDistance();
        
        let targetAzimuth = 0; // Due to DigitalTwinGlobe's group rotation of 195deg, Azimuth 0 is dead-center on India
        let targetPolar = Math.PI / 2; // Equator
        let targetDist = 5.35; // Default distance, no SAR zoom

        // Force shortest path mathematically
        while (targetAzimuth - startAzimuth > Math.PI) targetAzimuth -= 2 * Math.PI;
        while (targetAzimuth - startAzimuth < -Math.PI) targetAzimuth += 2 * Math.PI;
        
        animRef.current = {
            startAzimuth, targetAzimuth,
            startPolar, targetPolar,
            startDist, targetDist,
            progress: 0
        };

        // Kill all physics and momentum to prevent tug-of-war
        (controls as any).enabled = false;
        (controls as any).autoRotate = false;
        (controls as any).enableDamping = false; 
        
        setIsAnimating(true);
        
    }, [activeTab, _c, controls, recenterTrigger]);
    
    useFrame((_state, delta) => {
        if (!isAnimating || !controls) return;
        
        animRef.current.progress += delta * 1.5; // Clean, frame-rate independent speed
        
        if (animRef.current.progress <= 1) {
            const ease = 1 - Math.pow(1 - animRef.current.progress, 3); // Cubic ease-out
            
            const currentAzimuth = animRef.current.startAzimuth + (animRef.current.targetAzimuth - animRef.current.startAzimuth) * ease;
            const currentPolar = animRef.current.startPolar + (animRef.current.targetPolar - animRef.current.startPolar) * ease;
            const currentDist = animRef.current.startDist + (animRef.current.targetDist - animRef.current.startDist) * ease;
            
            camera.position.setFromSphericalCoords(currentDist, currentPolar, currentAzimuth);
            camera.lookAt(0, 0, 0);
            (controls as any).target.set(0,0,0);
            (controls as any).update();
        } else {
            setIsAnimating(false);
            (controls as any).enabled = true;
            (controls as any).enableDamping = true; // Restore physics
            (controls as any).autoRotate = !isRotationLocked; 
        }
    });

    return null;
}
`;

content = content.replace(oldFunc, newFunc);
fs.writeFileSync(file, content);
console.log('Fixed camera animation physics');
