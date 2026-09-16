with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

# Fix state hook
old_state = """  const { showGlobeArgo, setShowGlobeArgo } = useOceanStore();
  const [activeTab, setActiveTab] = useState<ViewMode>('climate');
  const [isRotationLocked, setIsRotationLocked] = useState(false);
  const navigate = useNavigate();
  const [liveData, setLiveData] = useState({ tchp: 85.4, depth: 75.2, gradient: -0.15, lat: 15.3, lon: 65.2, dmi: 1.4, sst: 29.5 });"""
new_state = """  const { showGlobeArgo, setShowGlobeArgo, selectedDate, setSelectedDate } = useOceanStore();
  const [activeTab, setActiveTab] = useState<ViewMode>('climate');
  const [isRotationLocked, setIsRotationLocked] = useState(false);
  const navigate = useNavigate();
  const [liveData, setLiveData] = useState({ tchp: 85.4, depth: 75.2, gradient: -0.15, lat: 15.3, lon: 65.2, dmi: 1.4, sst: 29.5, ssh: 0.5, u: 0.1, v: -0.2 });"""
code = code.replace(old_state, new_state)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

code = code.replace("isRotationLocked = false }: { viewMode?: 'navy' | 'fishery' | 'climate' | 'cable' | 'enso', isRotationLocked?: boolean }", "}: { viewMode?: 'navy' | 'fishery' | 'climate' | 'cable' | 'enso', isRotationLocked?: boolean }")

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
