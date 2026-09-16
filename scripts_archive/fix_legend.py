with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

legend_scale_old = """                  activeTab === 'climate' && climateMode === 'cyclone' ? 'linear-gradient(to right, #000000, #57106e, #bc3754, #f98e09, #fcffa4)' :
                  activeTab === 'climate' && climateMode === 'flood' ? 'linear-gradient(to right, #440154, #3b528b, #21918c, #5ec962, #fde725)' :
                  activeTab === 'climate' && climateMode === 'heatwave' ? 'linear-gradient(to right, #000000, #b30000, #ff3300, #ffcc00, #ffffff)' :
                  activeTab === 'climate' && climateMode === 'erosion' ? 'linear-gradient(to right, #ffffd9, #c7e9b4, #41b6c4, #225ea8, #081d58)' :"""

legend_scale_new = """                  activeTab === 'climate' && climateMode === 'cyclone' ? 'linear-gradient(to right, #000000, #57106e, #bc3754, #f98e09, #fcffa4)' :
                  activeTab === 'climate' && climateMode === 'flood' ? 'linear-gradient(to right, #000000, #1c2738, #3b5c73, #729eb3, #ffffff)' :
                  activeTab === 'climate' && climateMode === 'heatwave' ? 'linear-gradient(to right, #000000, #b30000, #ff3300, #ffcc00, #ffffff)' :
                  activeTab === 'climate' && climateMode === 'erosion' ? 'linear-gradient(to right, #000000, #004d00, #008055, #33cc99, #ffffff)' :"""

code = code.replace(legend_scale_old, legend_scale_new)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
