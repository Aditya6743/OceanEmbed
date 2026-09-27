const fs = require('fs');
let file = 'frontend/src/pages/Solutions.tsx';
let content = fs.readFileSync(file, 'utf8');

// Find the line where normal imports start (import { fetchOceanPrediction } from '../lib/api';)
const normalImportsStart = content.indexOf("import { fetchOceanPrediction } from '../lib/api';");

// Read everything after normal imports
let restOfFile = content.substring(normalImportsStart);

// Remove the old original CameraResetTrigger
const oldTriggerStart = restOfFile.indexOf("function CameraResetTrigger");
const endTriggerMarker = "export default function Solutions() {";
const oldTriggerEnd = restOfFile.indexOf(endTriggerMarker);
restOfFile = restOfFile.substring(0, oldTriggerStart) + restOfFile.substring(oldTriggerEnd);

// Construct clean top of file
const newTop = `import { Suspense, useState, useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
`;

const newTrigger = `
function CameraResetTrigger({ activeTab, climateMode: _c, isRotationLocked, recenterTrigger }: { activeTab: string, climateMode: string, isRotationLocked: boolean, recenterTrigger?: number }) {
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
        
        let targetAzimuth = 0; 
        let targetPolar = Math.PI / 2; 
        let targetDist = 5.35; 

        while (targetAzimuth - startAzimuth > Math.PI) targetAzimuth -= 2 * Math.PI;
        while (targetAzimuth - startAzimuth < -Math.PI) targetAzimuth += 2 * Math.PI;
        
        animRef.current = {
            startAzimuth, targetAzimuth,
            startPolar, targetPolar,
            startDist, targetDist,
            progress: 0
        };

        (controls as any).enabled = false;
        (controls as any).autoRotate = false;
        (controls as any).enableDamping = false; 
        
        setIsAnimating(true);
        
    }, [activeTab, _c, controls, recenterTrigger]);
    
    useFrame((_state, delta) => {
        if (!isAnimating || !controls) return;
        
        animRef.current.progress += delta * 1.5;
        
        if (animRef.current.progress <= 1) {
            const ease = 1 - Math.pow(1 - animRef.current.progress, 3);
            
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
            (controls as any).enableDamping = true;
            (controls as any).autoRotate = !isRotationLocked; 
        }
    });

    return null;
}

`;

fs.writeFileSync(file, newTop + restOfFile + newTrigger);
console.log('Fixed file corruption cleanly');
