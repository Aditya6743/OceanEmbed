function RotationController({ isRotationLocked }: { isRotationLocked: boolean }) {
    const { controls } = useThree();
    useFrame(() => {
        if (controls) {
            (controls as any).autoRotate = !isRotationLocked;
        }
    });
    return null;
}

function CameraResetTrigger({ activeTab, isRotationLocked }: { activeTab: string, isRotationLocked: boolean }) {
    const { camera, controls } = useThree();
    
    useEffect(() => {
        if (!controls) return;
        
        // 1. Completely lock out user and physics engine to prevent ANY glitches or fighting
        (controls as any).enabled = false;
        (controls as any).autoRotate = false;
        
        let animId: number;
        let progress = 0;
        
        let startAzimuth = (controls as any).getAzimuthalAngle();
        let startPolar = (controls as any).getPolarAngle();
        let startDist = (controls as any).getDistance();
        
        // Normalize azimuth for shortest path
        startAzimuth = startAzimuth % (2 * Math.PI);
        if (startAzimuth > Math.PI) startAzimuth -= 2 * Math.PI;
        if (startAzimuth < -Math.PI) startAzimuth += 2 * Math.PI;
        
        // The mathematically verified coordinates to center India based on MosdacGlobe's inherent rotation
        const targetAzimuth = 0; 
        const targetPolar = Math.PI / 2; 
        const targetDist = 5.35;
        
        const animate = () => {
            progress += 0.04; // Animation speed
            if (progress <= 1) {
                const ease = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
                
                const currentAzimuth = startAzimuth + (targetAzimuth - startAzimuth) * ease;
                const currentPolar = startPolar + (targetPolar - startPolar) * ease;
                const currentDist = startDist + (targetDist - startDist) * ease;
                
                // Directly control the camera using pure spherical math
                camera.position.setFromSphericalCoords(currentDist, currentPolar, currentAzimuth);
                camera.lookAt(0, 0, 0);
                (controls as any).target.set(0,0,0);
                
                // Call update to sync OrbitControls with the new camera position
                (controls as any).update();
                
                animId = requestAnimationFrame(animate);
            } else {
                // 2. Animation complete! Hand control perfectly back to the user
                (controls as any).enabled = true;
                (controls as any).autoRotate = !isRotationLocked; 
            }
        };
        
        animate();
        
        return () => {
            cancelAnimationFrame(animId);
            if (controls) {
                (controls as any).enabled = true;
            }
        };
    }, [activeTab, controls]);
    
    return null;
}


export default function Solutions() {
