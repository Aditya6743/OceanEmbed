import numpy as np

# The exactly 15 depth layers demanded by the SIH Problem Statement (in meters)
DEPTHS = np.array([0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000])

def calculate_tchp(temperature_profile):
    """
    Calculates Tropical Cyclone Heat Potential (TCHP).
    Finds the 26°C boundary and calculates total heat energy above it.
    """
    cp = 3985 # Specific heat of seawater
    rho = 1025 # Density of seawater
    
    if temperature_profile[0] < 26.0: return 0.0 # Too cold for cyclones
        
    tchp_energy = 0.0
    for i in range(len(DEPTHS) - 1):
        t_top, t_bottom = temperature_profile[i], temperature_profile[i+1]
        
        if t_top >= 26.0 and t_bottom < 26.0:
            fraction = (t_top - 26.0) / (t_top - t_bottom)
            layer_thickness = (DEPTHS[i+1] - DEPTHS[i]) * fraction
            avg_temp = (t_top + 26.0) / 2.0
            tchp_energy += cp * rho * layer_thickness * (avg_temp - 26.0)
            break
            
        elif t_top >= 26.0 and t_bottom >= 26.0:
            layer_thickness = DEPTHS[i+1] - DEPTHS[i]
            avg_temp = (t_top + t_bottom) / 2.0
            tchp_energy += cp * rho * layer_thickness * (avg_temp - 26.0)
            
    return tchp_energy / 10000000.0 # Convert to kJ/cm^2

def calculate_thermocline(temperature_profile):
    """
    Finds the depth where temperature drops the fastest (steepest gradient)
    """
    max_gradient = 0
    thermocline_depth = 0
    
    for i in range(len(DEPTHS) - 1):
        gradient = (temperature_profile[i+1] - temperature_profile[i]) / (DEPTHS[i+1] - DEPTHS[i])
        if gradient < max_gradient: # Looking for the most negative drop
            max_gradient = gradient
            thermocline_depth = (DEPTHS[i] + DEPTHS[i+1]) / 2.0
            
    return thermocline_depth

if __name__ == "__main__":
    print("\n--- Testing Ocean Physics Calculator ---")
    
    # Simulating a realistic AI prediction for the Bay of Bengal
    ai_predicted_profile = np.array([
        30.2, # 0m (Surface)
        30.1, # 5m
        29.8, # 10m
        29.5, # 20m
        29.0, # 30m
        28.2, # 50m
        26.5, # 75m
        23.1, # 100m  <-- Huge drop right here
        19.5, # 125m
        16.2, # 150m
        12.0, # 200m
        10.5, # 300m
        8.1,  # 500m
        6.5,  # 700m
        5.0   # 1000m
    ])
    
    tchp_score = calculate_tchp(ai_predicted_profile)
    thermocline = calculate_thermocline(ai_predicted_profile)
    
    print("\nAI Predicted Temperatures:")
    for depth, temp in zip(DEPTHS[:8], ai_predicted_profile[:8]):
        print(f"Depth {depth:3d}m: {temp}°C")
    print("...")
    
    print("\n[PHYSICS RESULTS]")
    print(f"TCHP (Cyclone Risk): {tchp_score:.2f} kJ/cm^2")
    if tchp_score > 60:
        print("  -> WARNING: High risk of rapid cyclone intensification!")
        
    print(f"Thermocline Depth:   {thermocline:.1f} meters")
    print("  -> Ideal acoustic depth for Navy submarines.")
