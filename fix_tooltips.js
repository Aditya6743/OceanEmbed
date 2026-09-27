const fs = require('fs');
let file = 'frontend/src/components/RoutingSar2DMap.tsx';
let content = fs.readFileSync(file, 'utf8');

// Define labels at the top of the component (inside the component so they can be recreated/memoized if needed, but since they don't depend on state mostly, just put them near vesselIcon)

const labelsCode = `
  const vesselAlphaLabel = useMemo(() => L.divIcon({
    className: 'bg-transparent',
    html: '<div class="bg-black/90 text-cyan-400 border border-cyan-500/50 rounded px-2 py-1 text-[9px] font-mono font-bold tracking-widest whitespace-nowrap backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.3)]" style="margin-left: -50%; margin-top: -35px;">VESSEL ALPHA</div>'
  }), []);

  const thermalHazardLabel = useMemo(() => L.divIcon({
    className: 'bg-transparent',
    html: '<div class="bg-amber-950/90 text-amber-400 border border-amber-500/50 rounded px-2 py-1 text-[9px] font-mono font-bold tracking-widest whitespace-nowrap backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.3)]" style="margin-left: -50%; margin-top: -12px;">THERMAL HAZARD</div>'
  }), []);

  const lkpLabel = useMemo(() => L.divIcon({
    className: 'bg-transparent',
    html: '<div class="bg-black/90 text-rose-400 border border-rose-500/50 rounded px-2 py-1 text-[9px] font-mono font-bold tracking-widest whitespace-nowrap backdrop-blur-md shadow-[0_0_15px_rgba(244,63,94,0.3)]" style="margin-left: -50%; margin-top: 15px;">LKP (INCIDENT)</div>'
  }), []);

  const searchAreaLabel = useMemo(() => L.divIcon({
    className: 'bg-transparent',
    html: \`<div class="bg-black/80 text-rose-400 border border-transparent rounded px-2 py-1 text-[9px] font-mono font-bold tracking-widest whitespace-nowrap backdrop-blur-sm" style="margin-left: -50%; margin-top: -40px;">SEARCH AREA (+\${sarTimeHour}H)</div>\`
  }), [sarTimeHour]);
`;

// Inject label definitions near vesselIcon
content = content.replace(
  /const vesselIcon = L\.divIcon\(\{/g,
  labelsCode + '\n  const vesselIcon = L.divIcon({'
);


// 1. Vessel Alpha
const vAlphaOld = `<Marker position={routePointsOpt[Math.floor(routePointsOpt.length * 0.5)]} icon={vesselIcon}>
                    <Tooltip permanent direction="top" offset={[0, -10]} className="bg-black/80 text-cyan-400 border-cyan-500/50">VESSEL ALPHA</Tooltip>
                 </Marker>`;
const vAlphaNew = `<Marker position={routePointsOpt[Math.floor(routePointsOpt.length * 0.5)]} icon={vesselIcon} />
                 <Marker position={routePointsOpt[Math.floor(routePointsOpt.length * 0.5)]} icon={vesselAlphaLabel} />`;
content = content.replace(vAlphaOld, vAlphaNew);


// 2. Thermal Hazard
const tHazardOld = `<Circle center={[12.35, 86.5]} radius={130000} pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.3, weight: 2 }}>
                 <Tooltip direction="center" permanent className="bg-transparent border-0 text-amber-500 shadow-none font-bold text-xs">THERMAL HAZARD</Tooltip>
              </Circle>`;
const tHazardNew = `<Circle center={[12.35, 86.5]} radius={130000} pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.3, weight: 2 }} />
              <Marker position={[12.35, 86.5]} icon={thermalHazardLabel} />`;
content = content.replace(tHazardOld, tHazardNew);


// 3. LKP
const lkpOld = `<Marker position={sStart} icon={lkpIcon}>
               <Tooltip direction="bottom" offset={[0, 10]} permanent className="bg-black/80 text-rose-400 border-rose-500/50">LKP (INCIDENT)</Tooltip>
            </Marker>`;
const lkpNew = `<Marker position={sStart} icon={lkpIcon} />
            <Marker position={sStart} icon={lkpLabel} />`;
content = content.replace(lkpOld, lkpNew);


// 4. Search Area
// Need to be careful with multi-line regex replacements. Let's just string split or use exact match.
const searchAreaOld = `<Circle center={currentSarPos} radius={sarRadius} pathOptions={{ color: '#f43f5e', fillColor: '#f43f5e', fillOpacity: 0.3, weight: 2 }}>
                   <Tooltip direction="top" permanent className="bg-transparent border-0 text-rose-400 shadow-none font-bold text-xs -mt-10">
                     SEARCH AREA (+{sarTimeHour}H)
                   </Tooltip>
                </Circle>`;
const searchAreaNew = `<Circle center={currentSarPos} radius={sarRadius} pathOptions={{ color: '#f43f5e', fillColor: '#f43f5e', fillOpacity: 0.3, weight: 2 }} />
                <Marker position={currentSarPos} icon={searchAreaLabel} />`;
content = content.replace(searchAreaOld, searchAreaNew);

fs.writeFileSync(file, content);
console.log('Replaced all Leaflet Tooltips with custom HTML styled divIcons');
