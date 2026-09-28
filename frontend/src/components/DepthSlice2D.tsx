import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { PredictionResponse } from '../types/ocean';
import { useOceanStore } from '../store/oceanStore';

export interface GridCell {
  lat: number;
  lon: number;
  temp: number;
}

export interface DepthSliceData {
  depth: number;
  lats: number[];
  lons: number[];
  grid: GridCell[][];
  minTemp: number;
  maxTemp: number;
}

class DeterministicMockProvider {
  static LAT_MIN = 5.0;
  static LAT_MAX = 30.0;
  static LON_MIN = 45.0;
  static LON_MAX = 105.0;
  static RESOLUTION = 0.25;

  static getBaseTempForDepth(depth: number): number {
    if (depth <= 50) return 29.5 - (depth / 50) * 1.0; 
    if (depth <= 200) return 28.5 - ((depth - 50) / 150) * 12.5; 
    if (depth <= 600) return 16.0 - ((depth - 200) / 400) * 7.0; 
    return 9.0 - ((depth - 600) / 400) * 4.0;
  }

  static async fetchSlice(depth: number, dateStr: string): Promise<DepthSliceData> {
    const lats: number[] = [];
    const lons: number[] = [];
    
    for (let lat = this.LAT_MAX; lat >= this.LAT_MIN; lat -= this.RESOLUTION) {
      lats.push(Number(lat.toFixed(2)));
    }
    for (let lon = this.LON_MIN; lon <= this.LON_MAX; lon += this.RESOLUTION) {
      lons.push(Number(lon.toFixed(2)));
    }

    const date = new Date(dateStr);
    const t = date.getTime() / 86400000; // days since epoch
    const month = date.getMonth(); 
    
    // Seasonal swing (peaks around August)
    const seasonShift = Math.cos((month - 7) / 12 * Math.PI * 2) * 1.5; 
    const depthAtten = Math.max(0, 1 - depth / 300); 
    
    const baseTemp = this.getBaseTempForDepth(depth) + seasonShift * depthAtten;
    const variance = Math.max(0.2, 2.5 * (1 - depth / 1000));
    
    // Time variable scaled up for drastic structural evolution
    const T = t * 0.08; 
    
    let minT = Infinity;
    let maxT = -Infinity;

    const grid: GridCell[][] = [];

    for (let r = 0; r < lats.length; r++) {
      const row: GridCell[] = [];
      const lat = lats[r];
      
      // Dynamic latitude gradient (flattens in summer, steepens in winter)
      const gradientStrength = (depth < 200 ? 3.0 : 0.8) - seasonShift * 0.5;
      const latGradient = ((lat - 5.0) / 25.0) * gradientStrength;
      
      for (let c = 0; c < lons.length; c++) {
        const lon = lons[c];
        
        // 1. Base coordinate with westward drift (Rossby wave simulation)
        const x = lon + T * 0.3;
        const y = lat;
        
        // 2. DOMAIN WARPING
        // This completely scrambles the spatial coordinates over time, causing
        // red/blue patches to literally stretch, merge, and physically move across the map!
        const warpX = Math.sin(y * 0.3 + T * 0.4) * 3.5 + Math.cos(x * 0.2 - T * 0.2) * 2.5;
        const warpY = Math.cos(x * 0.4 - T * 0.3) * 3.5 + Math.sin(y * 0.3 + T * 0.5) * 2.5;
        
        const wx = x + warpX;
        const wy = y + warpY;
        
        // 3. FBM (Fractal Brownian Motion) using warped coordinates
        const f1 = Math.sin(wx * 0.4 + wy * 0.3) + Math.cos(wx * 0.2 - wy * 0.5);
        const f2 = Math.sin(wx * 0.9 - wy * 0.8 + depth*0.01) * Math.cos(wy * 1.1 + wx * 0.6);
        const f3 = Math.cos(wx * 2.1 + wy * 1.9) * Math.sin(wy * 2.3 - wx * 1.7);
        const f4 = Math.sin(wx * 4.5 - wy * 4.1) * Math.cos(wy * 3.9 + wx * 4.3);
        
        const noise = (f1 + f2*0.6 + f3*0.3 + f4*0.15) * 0.6;
        
        // 4. Somalian / Oman Upwelling (Seasonal)
        let upwelling = 0;
        if (depth < 300) {
           const distOman = Math.sqrt(Math.pow(lat - 18, 2) + Math.pow(lon - 58, 2));
           if (distOman < 8) {
               const monsoonIntensity = Math.max(0, Math.cos((month - 7) / 12 * Math.PI * 2));
               upwelling -= (8 - distOman) * 0.8 * monsoonIntensity * (1 - depth/300);
           }
        }
        
        const temp = Number((baseTemp - latGradient + noise * variance + upwelling).toFixed(2));
        
        if (temp < minT) minT = temp;
        if (temp > maxT) maxT = temp;
        
        row.push({ lat, lon, temp });
      }
      grid.push(row);
    }

    return { depth, lats, lons, grid, minTemp: minT, maxTemp: maxT };
  }
}

const getGlobalColor = (temp: number) => {
  const min = 0, max = 32;
  const t = Math.max(0, Math.min(1, (temp - min) / (max - min)));
  const stops = [
    { v: 0.00, c: [5, 10, 40] },     
    { v: 0.20, c: [20, 80, 180] },   
    { v: 0.40, c: [30, 160, 220] },  
    { v: 0.60, c: [40, 200, 140] },  
    { v: 0.80, c: [220, 200, 40] },  
    { v: 0.90, c: [240, 120, 20] },  
    { v: 1.00, c: [220, 30, 30] }    
  ];
  let c1 = stops[0], c2 = stops[1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i].v && t <= stops[i+1].v) {
      c1 = stops[i]; c2 = stops[i+1]; break;
    }
  }
  const factor = (t - c1.v) / (c2.v - c1.v || 1);
  const r = Math.round(c1.c[0] + factor * (c2.c[0] - c1.c[0]));
  const g = Math.round(c1.c[1] + factor * (c2.c[1] - c1.c[1]));
  const b = Math.round(c1.c[2] + factor * (c2.c[2] - c1.c[2]));
  return `rgb(${r}, ${g}, ${b})`;
};

export default function DepthSlice2D({ prediction }: { prediction?: PredictionResponse }) {
  const { selectedDate } = useOceanStore();
  
  const availableDepths = prediction?.profile?.depth || [0, 50, 100, 200, 400, 600, 800, 1000];
  
  const [sliderDepth, setSliderDepth] = useState<number>(availableDepths[0]);
  const [activeDepth, setActiveDepth] = useState<number>(availableDepths[0]);
  
  const [sliceData, setSliceData] = useState<DepthSliceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [hoveredCell, setHoveredCell] = useState<GridCell | null>(null);
  const [selectedCell, setSelectedCell] = useState<GridCell | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleAutopilotDepth = (e: any) => {
      setSliderDepth(e.detail);
      setActiveDepth(e.detail);
      useOceanStore.setState({ hoveredDepth: e.detail });
    };
    window.addEventListener('autopilot-depth', handleAutopilotDepth);
    return () => window.removeEventListener('autopilot-depth', handleAutopilotDepth);
  }, []);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<any>(null);
  const [resizeTick, setResizeTick] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const [specularMap, setSpecularMap] = useState<HTMLImageElement | null>(null);
  const maskDataRef = useRef<{ data: Uint8ClampedArray, width: number, height: number } | null>(null);

  // --- Robust State Sync for Zoom/Pan ---
  const [zoomState, setZoomState] = useState(1);
  const [panState, setPanState] = useState({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  const panRef = useRef({ x: 0, y: 0 });
  const layoutRef = useRef({ cw: 0, ch: 0, drawW: 0, drawH: 0, offsetX: 0, offsetY: 0 });
  
  const isPanning = useRef(false);
  const hasMoved = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const clampPan = (px: number, py: number, currentZoom: number) => {
    const { cw, ch, drawW, drawH, offsetX, offsetY } = layoutRef.current;
    if (cw === 0) return { x: px, y: py };
    
    const minX = cw - (drawW * currentZoom) - offsetX;
    const maxX = -offsetX;
    const minY = ch - (drawH * currentZoom) - offsetY;
    const maxY = -offsetY;
    
    return {
      x: Math.min(Math.max(px, minX), maxX),
      y: Math.min(Math.max(py, minY), maxY)
    };
  };

  const applyZoom = useCallback((dz: number) => {
    const oldZ = zoomRef.current;
    const newZ = Math.max(1, Math.min(oldZ + dz, 5));
    if (newZ === oldZ) return;

    let ux = 0, uy = 0;
    if (selectedCell && sliceData) {
      const percentX = sliceData.lons.indexOf(selectedCell.lon) / (sliceData.lons.length - 1);
      const percentY = sliceData.lats.indexOf(selectedCell.lat) / (sliceData.lats.length - 1);
      ux = percentX * layoutRef.current.drawW;
      uy = percentY * layoutRef.current.drawH;
    } else {
      ux = layoutRef.current.drawW / 2;
      uy = layoutRef.current.drawH / 2;
    }

    const oldPan = panRef.current;
    const newPx = oldPan.x + ux * (oldZ - newZ);
    const newPy = oldPan.y + uy * (oldZ - newZ);
    
    const clampedPan = clampPan(newPx, newPy, newZ);
    
    zoomRef.current = newZ;
    panRef.current = clampedPan;
    setZoomState(newZ);
    setPanState(clampedPan);
  }, [selectedCell, sliceData]);

  const handleZoomIn = () => applyZoom(0.5);
  const handleZoomOut = () => applyZoom(-0.5);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const dz = e.deltaY * -0.005;
      
      const oldZ = zoomRef.current;
      const newZ = Math.max(1, Math.min(oldZ + dz, 5));
      if (newZ === oldZ) return;

      const container = containerRef.current;
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      const cx = e.clientX - containerRect.left;
      const cy = e.clientY - containerRect.top;
      
      const oldPan = panRef.current;
      const { offsetX, offsetY } = layoutRef.current;
      
      const ux = (cx - offsetX - oldPan.x) / oldZ;
      const uy = (cy - offsetY - oldPan.y) / oldZ;

      const newPx = oldPan.x + ux * (oldZ - newZ);
      const newPy = oldPan.y + uy * (oldZ - newZ);
      
      const clampedPan = clampPan(newPx, newPy, newZ);
      
      zoomRef.current = newZ;
      panRef.current = clampedPan;
      setZoomState(newZ);
      setPanState(clampedPan);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = '/textures/earth_specular.jpg';
    img.crossOrigin = "Anonymous";
    img.onload = () => setSpecularMap(img);
    
    let resizeTimer: any;
    const handleResizeTick = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => setResizeTick(prev => prev + 1), 30);
    };

    window.addEventListener('resize', handleResizeTick);

    const rootContainer = rootRef.current;
    let rootObserver: ResizeObserver | null = null;
    
    if (rootContainer) {
      rootObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          setIsMinimized(entry.contentRect.width < 768);
        }
        handleResizeTick();
      });
      rootObserver.observe(rootContainer);
    }

    return () => {
      window.removeEventListener('resize', handleResizeTick);
      if (rootObserver) rootObserver.disconnect();
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      const data = await DeterministicMockProvider.fetchSlice(activeDepth, selectedDate || '2026-06-01');
      if (isMounted) {
        setSliceData(data);
        setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [activeDepth, selectedDate]); 

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const wrapper = mapWrapperRef.current;
    if (!canvas || !container || !wrapper || !sliceData || !specularMap) return;
    
    const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    
    if (cw === 0 || ch === 0) return;

    const targetAR = 2.4; 
    let drawW = cw;
    let drawH = ch;
    
    if (cw / ch > targetAR) {
      drawW = cw;
      drawH = cw / targetAR;
    } else {
      drawW = ch * targetAR;
      drawH = ch;
    }

    // If container is narrow (like minimized mode), target India (~78E) instead of domain center (~75E)
    // Domain: 45E to 105E (60 range). 78E is (78 - 45) / 60 = 0.55
    let offsetX = (cw - drawW) / 2;
    if (cw / ch < targetAR) {
      offsetX = (cw / 2) - (drawW * 0.55);
    }
    const offsetY = (ch - drawH) / 2;
    layoutRef.current = { cw, ch, drawW, drawH, offsetX, offsetY };

    wrapper.style.width = `${drawW}px`;
    wrapper.style.height = `${drawH}px`;
    wrapper.style.left = `${offsetX}px`;
    wrapper.style.top = `${offsetY}px`;

    panRef.current = clampPan(panRef.current.x, panRef.current.y, zoomRef.current);
    setPanState(panRef.current);

    canvas.width = drawW * dpr;
    canvas.height = drawH * dpr;
    ctx.scale(dpr, dpr);

    const imgW = specularMap.width;
    const imgH = specularMap.height;
    
    const latTop = DeterministicMockProvider.LAT_MAX;
    const latBot = DeterministicMockProvider.LAT_MIN;
    const lonLeft = DeterministicMockProvider.LON_MIN;
    const lonRight = DeterministicMockProvider.LON_MAX;

    const sy = imgH * ((90 - latTop) / 180);
    const sh = imgH * ((latTop - latBot) / 180);
    const sx = imgW * ((lonLeft + 180) / 360);
    const sw = imgW * ((lonRight - lonLeft) / 360);

    const landCanvas = document.createElement('canvas');
    landCanvas.width = drawW;
    landCanvas.height = drawH;
    const lCtx = landCanvas.getContext('2d', { willReadFrequently: true });
    if (!lCtx) return;
    
    lCtx.drawImage(specularMap, sx, sy, sw, sh, 0, 0, drawW, drawH);
    
    const imgData = lCtx.getImageData(0, 0, drawW, drawH);
    const data = imgData.data;
    const rawMask = new Uint8ClampedArray(data.length / 4);
    
    for (let i = 0; i < data.length; i += 4) {
      const brightness = data[i];
      rawMask[i/4] = brightness;
      const isLand = brightness < 128;
      if (isLand) {
        data[i] = 15; data[i+1] = 23; data[i+2] = 42; data[i+3] = 255;
      } else {
        data[i+3] = 0; 
      }
    }
    lCtx.putImageData(imgData, 0, 0);
    maskDataRef.current = { data: rawMask, width: imgData.width, height: imgData.height };

    const heatCanvas = document.createElement('canvas');
    heatCanvas.width = drawW;
    heatCanvas.height = drawH;
    const hCtx = heatCanvas.getContext('2d');
    if (!hCtx) return;

    const rows = sliceData.grid.length;
    const cols = sliceData.grid[0].length;
    const cellW = drawW / cols;
    const cellH = drawH / rows;
    
    sliceData.grid.forEach((row, r) => {
      row.forEach((cell, c) => {
        hCtx.fillStyle = getGlobalColor(cell.temp);
        hCtx.fillRect(Math.floor(c * cellW), Math.floor(r * cellH), Math.ceil(cellW) + 1, Math.ceil(cellH) + 1);
      });
    });

    // --- PREMIUM GRID MESH ---
    const gridCanvas = document.createElement('canvas');
    gridCanvas.width = drawW;
    gridCanvas.height = drawH;
    const gCtx = gridCanvas.getContext('2d');
    if (gCtx) {
      gCtx.strokeStyle = 'rgba(0, 0, 0, 0.28)'; 
      gCtx.lineWidth = 0.8; // Slightly thicker and more opaque for visibility
      gCtx.beginPath();
      // Using native sub-pixel anti-aliasing instead of Math.floor integer snapping
      // This eliminates the Moire "double grid" effect while allowing every cell to be traced
      for(let r = 0; r <= rows; r++) { 
        gCtx.moveTo(0, r * cellH); 
        gCtx.lineTo(drawW, r * cellH); 
      }
      for(let c = 0; c <= cols; c++) { 
        gCtx.moveTo(c * cellW, 0); 
        gCtx.lineTo(c * cellW, drawH); 
      }
      gCtx.stroke();
      
      gCtx.globalCompositeOperation = 'destination-out';
      gCtx.drawImage(landCanvas, 0, 0);
      gCtx.globalCompositeOperation = 'source-over';
    }

    // --- MAIN RENDER ---
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, drawW, drawH);
    ctx.drawImage(heatCanvas, 0, 0);
    
    if (gCtx) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(gridCanvas, 0, 0);
    }

    // --- LANDMASS ---
    // Using a single drop-shadow to prevent Safari rendering bugs where dual-shadows cause transparency
    ctx.filter = 'drop-shadow(0px 0px 6px rgba(0,0,0,0.9))';
    ctx.drawImage(landCanvas, 0, 0);
    ctx.filter = 'none';

    if (selectedCell) {
      const r = sliceData.lats.indexOf(selectedCell.lat);
      const c = sliceData.lons.indexOf(selectedCell.lon);
      if (r >= 0 && c >= 0) {
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 2.0;
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 10;
        ctx.strokeRect(c * cellW, r * cellH, cellW, cellH);
        ctx.shadowBlur = 0;
      }
    }
  }, [sliceData, specularMap, resizeTick, selectedCell]); 

  // --- Pointer Handlers for Pan & Hover ---
  const handleMapPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isPanning.current = true;
    hasMoved.current = false;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleMapPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isPanning.current) {
      hasMoved.current = true;
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      
      const oldPan = panRef.current;
      const newPan = clampPan(oldPan.x + dx, oldPan.y + dy, zoomRef.current);
      panRef.current = newPan;
      setPanState(newPan);
      
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    } else {
      if (!sliceData || !maskDataRef.current || !mapWrapperRef.current) return;
      
      const rect = mapWrapperRef.current.getBoundingClientRect();
      
      // Normalized coordinates (0.0 to 1.0) strictly inside the map boundaries
      const normX = (e.clientX - rect.left) / rect.width;
      const normY = (e.clientY - rect.top) / rect.height;
      
      const { data, width, height } = maskDataRef.current;
      
      const maskX = Math.floor(normX * width);
      const maskY = Math.floor(normY * height);
      
      let isLandImage = false;
      if (maskX >= 0 && maskX < width && maskY >= 0 && maskY < height) {
         const idx = maskY * width + maskX;
         isLandImage = data[idx] < 128; 
      }
      
      if (isLandImage) {
         setHoveredCell(null);
         if (mapWrapperRef.current) mapWrapperRef.current.style.cursor = 'default';
         return;
      }
      
      const rows = sliceData.grid.length;
      const cols = sliceData.grid[0].length;
      const c = Math.floor(normX * cols);
      const r = Math.floor(normY * rows);
      
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        setHoveredCell(sliceData.grid[r][c]);
        if (mapWrapperRef.current) mapWrapperRef.current.style.cursor = zoomRef.current > 1 ? 'grab' : 'crosshair';
      } else {
        setHoveredCell(null);
        if (mapWrapperRef.current) mapWrapperRef.current.style.cursor = 'default';
      }
    }
  };

  const handleMapPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isPanning.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleMapClick = () => {
    if (hasMoved.current) return;
    if (hoveredCell && !loading) {
      setSelectedCell(hoveredCell);
      useOceanStore.setState({ 
        selectedLocation: { latitude: hoveredCell.lat, longitude: hoveredCell.lon, date: selectedDate || '2026-06-01', region: 'NORTH INDIAN OCEAN' }
      });
    }
  };

  const updateDepthFromEvent = useCallback((clientX: number, isDragging: boolean) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    let pct = (clientX - rect.left) / rect.width;
    pct = Math.max(0, Math.min(1, pct));
    const maxDepth = availableDepths[availableDepths.length - 1] || 1000;
    const targetDepth = pct * maxDepth;
    const newDepth = availableDepths.reduce((prev, curr) => Math.abs(curr - targetDepth) < Math.abs(prev - targetDepth) ? curr : prev);
    
    setSliderDepth(newDepth);
    useOceanStore.setState({ hoveredDepth: newDepth });

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    
    if (isDragging) {
      debounceTimerRef.current = setTimeout(() => {
        setActiveDepth(newDepth);
      }, 150);
    } else {
      setActiveDepth(newDepth);
    }
  }, [availableDepths]);

  const handleDepthPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    const track = trackRef.current;
    if (track) track.setPointerCapture(e.pointerId);
    updateDepthFromEvent(e.clientX, true);
  }, [updateDepthFromEvent]);

  const handleDepthPointerMove = useCallback((e: React.PointerEvent) => {
    if (!trackRef.current || !trackRef.current.hasPointerCapture(e.pointerId)) return;
    updateDepthFromEvent(e.clientX, true);
  }, [updateDepthFromEvent]);

  const handleDepthPointerUp = useCallback((e: React.PointerEvent) => {
    const track = trackRef.current;
    if (track && track.hasPointerCapture(e.pointerId)) {
      track.releasePointerCapture(e.pointerId);
      updateDepthFromEvent(e.clientX, false);
    }
  }, [updateDepthFromEvent]);

  return (
    <div ref={rootRef} className="w-full h-full flex flex-col bg-[#020617] font-sans overflow-hidden">
      
      <div className={`px-5 py-3 shrink-0 bg-[#0a0f1a] flex flex-wrap items-center gap-4 border-b border-white/5 shadow-md z-30 ${isMinimized ? 'justify-center' : 'justify-between'}`}>
        {!isMinimized && (
          <div className="flex-1 min-w-[200px]">
            <h3 className="text-[14px] font-bold text-cyan-400 tracking-[0.2em] uppercase flex items-center gap-3">
              HORIZONTAL TEMPERATURE SLICE
              
            </h3>
            <p className="text-[11px] text-white/70 tracking-wider mt-1">2D layer dynamically extracted from the 3D thermodynamic volume</p>
          </div>
        )}
        
        <div className={`flex items-center gap-4 bg-black/40 border border-white/10 rounded-full pl-5 pr-4 py-1.5 shadow-inner ${isMinimized ? 'w-full max-w-[400px]' : 'shrink-0'}`}>
          <div className="flex flex-col text-right shrink-0">
             <span className="text-[8px] font-mono text-cyan-400/80 tracking-widest uppercase">DEPTH</span>
             <span className="text-[14px] font-bold text-white leading-none">{sliderDepth} <span className="text-[10px] text-white/50">m</span></span>
          </div>
          
          <div 
            ref={trackRef}
            className={`relative h-6 flex items-center cursor-ew-resize group select-none touch-none ${isMinimized ? 'flex-1' : 'w-[150px]'}`}
            onPointerDown={handleDepthPointerDown}
            onPointerMove={handleDepthPointerMove}
            onPointerUp={handleDepthPointerUp}
            onPointerCancel={handleDepthPointerUp}
          >
            <div className="absolute left-0 right-0 h-[2px] bg-white/10 rounded"></div>
            <div 
              className="absolute left-0 h-[2px] bg-cyan-500 rounded shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all duration-75"
              style={{ width: `${(sliderDepth / (availableDepths[availableDepths.length - 1] || 1000)) * 100}%` }}
            ></div>
            <div 
              className="absolute w-[12px] h-[12px] rounded-full bg-black border-2 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-transform duration-75 group-hover:scale-125 z-10"
              style={{ left: `${(sliderDepth / (availableDepths[availableDepths.length - 1] || 1000)) * 100}%`, transform: 'translateX(-50%)' }}
            ></div>
          </div>
        </div>
      </div>

      <div 
        ref={containerRef} 
        className="flex-1 w-full relative bg-[#0a0f1a] overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,1)]"
      >
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] z-20"></div>

        <div className="absolute top-4 right-6 z-40 pointer-events-none drop-shadow-lg">
          <span className="text-[9px] text-cyan-400/80 border border-cyan-500/30 px-2 py-1 rounded bg-black/60 tracking-widest backdrop-blur-sm">0.25° × 0.25° GRID</span>
        </div>
        
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-40">
          <button onClick={handleZoomIn} className="w-8 h-8 bg-black/80 hover:bg-black border border-cyan-500/30 hover:border-cyan-400 rounded flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur transition-all font-mono font-bold text-lg leading-none">
            +
          </button>
          <button onClick={handleZoomOut} className="w-8 h-8 bg-black/80 hover:bg-black border border-cyan-500/30 hover:border-cyan-400 rounded flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur transition-all font-mono font-bold text-lg leading-none">
            -
          </button>
        </div>

        {sliceData && (
          <>
            <div className="absolute top-4 left-4 z-40 pointer-events-none">
              <span className="bg-black/80 border border-cyan-500/30 text-cyan-400 px-2 py-1 rounded backdrop-blur-md shadow-lg text-[10px] font-mono font-bold">{sliceData.lats[0].toFixed(0)}°N</span>
            </div>
            <div className="absolute bottom-6 left-4 z-40 pointer-events-none flex flex-col gap-2">
              <span className="bg-black/80 border border-cyan-500/30 text-cyan-400 px-2 py-1 rounded backdrop-blur-md shadow-lg text-[10px] font-mono font-bold">{sliceData.lats[sliceData.lats.length-1].toFixed(0)}°N</span>
              <span className="bg-black/80 border border-cyan-500/30 text-cyan-400 px-2 py-1 rounded backdrop-blur-md shadow-lg text-[10px] font-mono font-bold">{sliceData.lons[0].toFixed(0)}°E</span>
            </div>
            <div className="absolute bottom-6 right-[4.5rem] z-40 pointer-events-none">
              <span className="bg-black/80 border border-cyan-500/30 text-cyan-400 px-2 py-1 rounded backdrop-blur-md shadow-lg text-[10px] font-mono font-bold">{sliceData.lons[sliceData.lons.length-1].toFixed(0)}°E</span>
            </div>
          </>
        )}

        <div 
          ref={mapWrapperRef}
          className="absolute origin-top-left transition-transform duration-100 ease-out"
          style={{ transform: `translate(${panState.x}px, ${panState.y}px) scale(${zoomState})`, cursor: zoomState > 1 ? (isPanning.current ? 'grabbing' : 'grab') : (hoveredCell ? 'crosshair' : 'default') }}
          onPointerDown={handleMapPointerDown}
          onPointerMove={handleMapPointerMove}
          onPointerUp={handleMapPointerUp}
          onPointerLeave={() => setHoveredCell(null)}
          onClick={handleMapClick}
        >
          {!specularMap && (
            <div className="absolute inset-0 flex items-center justify-center text-white/20 text-xs tracking-widest uppercase z-10">
              Loading Geographic Datasets...
            </div>
          )}

          <canvas 
            ref={canvasRef}
            className="absolute inset-0 w-full h-full transition-opacity duration-300 z-0"
            style={{ opacity: loading ? 0.4 : 1 }}
          />

          {hoveredCell && !loading && sliceData && (() => {
            const percentY = sliceData.lats.indexOf(hoveredCell.lat) / (sliceData.lats.length - 1);
            const percentX = sliceData.lons.indexOf(hoveredCell.lon) / (sliceData.lons.length - 1);
            
            let { drawW, drawH } = layoutRef.current;
            
            const top = percentY * drawH;
            const left = percentX * drawW;

            return (
              <div 
                className="absolute z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full pb-2"
                style={{ 
                  top: `${top}px`, 
                  left: `${left}px`
                }}
              >
                <div className="bg-black/80 backdrop-blur-md border border-cyan-500/30 rounded px-2 py-1 shadow-lg flex flex-col items-center gap-0.5 whitespace-nowrap min-w-max">
                  <div className="text-[11px] font-bold text-white flex items-center gap-1.5 leading-none">
                    {hoveredCell.temp.toFixed(2)}°C
                  </div>
                  <div className="text-[8px] font-mono text-cyan-400/70 tracking-widest leading-none">
                    {hoveredCell.lat.toFixed(2)}°N, {hoveredCell.lon.toFixed(2)}°E
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}