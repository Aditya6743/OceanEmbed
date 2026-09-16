import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

# Replace sharedUniforms usage with explicit uniforms for each shader
code = code.replace("uniforms={sharedUniforms}", "")

# We need to inject uniforms={{ time: { value: 0 }, earthMap: { value: specularMap }, [specificMap]: { value: [specificMap] } }}
code = code.replace(
    "fragmentShader={tchpFragmentShader}",
    "fragmentShader={tchpFragmentShader} uniforms={{ time: { value: 0 }, earthMap: { value: specularMap }, tchpMap: { value: tchpMap } }}"
)
code = code.replace(
    "fragmentShader={floodFragmentShader}",
    "fragmentShader={floodFragmentShader} uniforms={{ time: { value: 0 }, earthMap: { value: specularMap }, sshMap: { value: sshMap } }}"
)
code = code.replace(
    "fragmentShader={heatwaveFragmentShader}",
    "fragmentShader={heatwaveFragmentShader} uniforms={{ time: { value: 0 }, earthMap: { value: specularMap }, sstMap: { value: sstMap } }}"
)
code = code.replace(
    "fragmentShader={erosionFragmentShader}",
    "fragmentShader={erosionFragmentShader} uniforms={{ time: { value: 0 }, earthMap: { value: specularMap }, currentsMap: { value: currentsMap } }}"
)
code = code.replace(
    "fragmentShader={fisheryFragmentShader}",
    "fragmentShader={fisheryFragmentShader} uniforms={{ time: { value: 0 }, earthMap: { value: specularMap }, fisheryMap: { value: fisheryMap } }}"
)
code = code.replace(
    "fragmentShader={navyFragmentShader}",
    "fragmentShader={navyFragmentShader} uniforms={{ time: { value: 0 }, earthMap: { value: specularMap }, navyMap: { value: navyMap } }}"
)
code = code.replace(
    "fragmentShader={cableFragmentShader}",
    "fragmentShader={cableFragmentShader} uniforms={{ time: { value: 0 }, earthMap: { value: specularMap }, benthicMap: { value: benthicMap } }}"
)
code = code.replace(
    "fragmentShader={ensoFragmentShader}",
    "fragmentShader={ensoFragmentShader} uniforms={{ time: { value: 0 }, earthMap: { value: specularMap }, iodMap: { value: iodMap } }}"
)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
