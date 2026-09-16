import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

old_call = "setActivePin({ lat, lon, point: surfacePoint, val });"

new_call = """setActivePin({ lat, lon, point: surfacePoint, val, isLoading: true });
    
    // FETCH REAL PHYSICS DATA FROM BACKEND
    fetchOceanPrediction(lat, lon, selectedDate || '2026-06-01').then(res => {
        setActivePin(prev => {
            if (prev && prev.lat === lat && prev.lon === lon) {
                return { ...prev, isLoading: false, realData: res };
            }
            return prev;
        });
    }).catch(err => {
        console.error(err);
        setActivePin(prev => prev ? { ...prev, isLoading: false } : null);
    });"""

code = code.replace(old_call, new_call)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
print("Injected fetch logic.")
