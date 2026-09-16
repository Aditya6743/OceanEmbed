with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

code = code.replace("const IotBeacon = ({ lat, lon, color, label }: { lat: number, lon: number, color: string, label: string }) => {", "const IotBeacon = ({ lat, lon, color }: { lat: number, lon: number, color: string }) => {")
code = code.replace("  const meshRef = useRef<THREE.Mesh>(null);", "")
code = code.replace("label=\"Mumbai Siren\"", "")
code = code.replace("label=\"Fisherman 402\"", "")
code = code.replace("label=\"Coast Guard\"", "")
code = code.replace("label=\"Gujarat Sensor\"", "")
code = code.replace("label=\"Kerala Sensor\"", "")

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
