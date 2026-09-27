let startAzimuth = 0;
let targetAzimuth = (70 + 180) * Math.PI / 180 - Math.PI / 2; // ~2.8

targetAzimuth = targetAzimuth % (2 * Math.PI);
if (targetAzimuth > Math.PI) targetAzimuth -= 2 * Math.PI;
if (targetAzimuth < -Math.PI) targetAzimuth += 2 * Math.PI;

if (targetAzimuth - startAzimuth > Math.PI) {
    targetAzimuth -= 2 * Math.PI;
} else if (targetAzimuth - startAzimuth < -Math.PI) {
    targetAzimuth += 2 * Math.PI;
}

console.log('Target Azimuth:', targetAzimuth);
