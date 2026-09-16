import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

target = """  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(`${BASE_URL}/spatial/heatmap/tchp`, setTchpMap, undefined, () => console.warn('Failed to load tchp'));
    loader.load(`${BASE_URL}/spatial/heatmap/fishery`, setFisheryMap);
    loader.load(`${BASE_URL}/spatial/heatmap/navy`, setNavyMap);
    loader.load(`${BASE_URL}/spatial/heatmap/benthic`, setBenthicMap);
    loader.load(`${BASE_URL}/spatial/heatmap/iod`, setIodMap);
  }, []);"""

replacement = """  const { selectedDate } = useOceanStore();
  
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const query = `?date=${selectedDate}`;
    loader.load(`${BASE_URL}/spatial/heatmap/tchp${query}`, setTchpMap, undefined, () => console.warn('Failed to load tchp'));
    loader.load(`${BASE_URL}/spatial/heatmap/fishery${query}`, setFisheryMap);
    loader.load(`${BASE_URL}/spatial/heatmap/navy${query}`, setNavyMap);
    loader.load(`${BASE_URL}/spatial/heatmap/benthic${query}`, setBenthicMap);
    loader.load(`${BASE_URL}/spatial/heatmap/iod${query}`, setIodMap);
  }, [selectedDate]);"""

code = code.replace(target, replacement)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
