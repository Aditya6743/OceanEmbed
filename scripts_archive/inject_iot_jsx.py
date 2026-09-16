with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

beacon_jsx = """
      {/* IOT HARDWARE BEACONS */}
      {viewMode === 'iot' && (
        <group>
          {/* Mumbai Siren */}
          <IotBeacon lat={18.922} lon={72.8347} color="#f43f5e" label="Mumbai Siren" />
          {/* Offline Fisherman at Sea */}
          <IotBeacon lat={15.5} lon={68.0} color="#f43f5e" label="Fisherman 402" />
          {/* Coast Guard Terminal (Chennai) */}
          <IotBeacon lat={13.0827} lon={80.2707} color="#38bdf8" label="Coast Guard" />
          {/* Additional Coastal Sensors */}
          <IotBeacon lat={22.309} lon={70.802} color="#10b981" label="Gujarat Sensor" />
          <IotBeacon lat={8.524} lon={76.936} color="#10b981" label="Kerala Sensor" />
        </group>
      )}
"""

target = "<ambientLight intensity={1.2} color=\"#ffffff\" />"
code = code.replace(target, target + beacon_jsx)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
