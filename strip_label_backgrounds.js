const fs = require('fs');
let file = 'frontend/src/components/RoutingSar2DMap.tsx';
let content = fs.readFileSync(file, 'utf8');

const vAlphaOld = '<div class="bg-black/90 text-cyan-400 border border-cyan-500/50 rounded px-2 py-1 text-[9px] font-mono font-bold tracking-widest whitespace-nowrap backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.3)]" style="margin-left: -50%; margin-top: -35px;">VESSEL ALPHA</div>';
const vAlphaNew = '<div class="text-cyan-400 text-[10px] font-mono font-bold tracking-widest whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,1)]" style="margin-left: -50%; margin-top: -30px;">VESSEL ALPHA</div>';

const tHazardOld = '<div class="bg-amber-950/90 text-amber-400 border border-amber-500/50 rounded px-2 py-1 text-[9px] font-mono font-bold tracking-widest whitespace-nowrap backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.3)]" style="margin-left: -50%; margin-top: -12px;">THERMAL HAZARD</div>';
const tHazardNew = '<div class="text-amber-500 text-[10px] font-mono font-bold tracking-widest whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,1)]" style="margin-left: -50%; margin-top: -12px;">THERMAL HAZARD</div>';

const lkpOld = '<div class="bg-black/90 text-rose-400 border border-rose-500/50 rounded px-2 py-1 text-[9px] font-mono font-bold tracking-widest whitespace-nowrap backdrop-blur-md shadow-[0_0_15px_rgba(244,63,94,0.3)]" style="margin-left: -50%; margin-top: 15px;">LKP (INCIDENT)</div>';
const lkpNew = '<div class="text-rose-400 text-[10px] font-mono font-bold tracking-widest whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,1)]" style="margin-left: -50%; margin-top: 15px;">LKP (INCIDENT)</div>';

const searchOld = '<div class="bg-black/80 text-rose-400 border border-transparent rounded px-2 py-1 text-[9px] font-mono font-bold tracking-widest whitespace-nowrap backdrop-blur-sm" style="margin-left: -50%; margin-top: -40px;">SEARCH AREA (+${sarTimeHour}H)</div>';
const searchNew = '<div class="text-rose-400 text-[10px] font-mono font-bold tracking-widest whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,1)]" style="margin-left: -50%; margin-top: -35px;">SEARCH AREA (+${sarTimeHour}H)</div>';

content = content.replace(vAlphaOld, vAlphaNew);
content = content.replace(tHazardOld, tHazardNew);
content = content.replace(lkpOld, lkpNew);
content = content.replace(searchOld, searchNew);

fs.writeFileSync(file, content);
console.log('Stripped backgrounds from map labels');
