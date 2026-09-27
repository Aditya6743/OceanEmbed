const fs = require('fs');
let file = 'frontend/src/components/IotBeaconsPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldBlock = `<div className="flex gap-2 mb-2">
                    <button onClick={() => runSimulation(true, simState.isMuted)} disabled={simState.isRunning} className="flex-1 py-1.5 rounded text-[9px] font-bold bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700 disabled:opacity-50">TEST BEACON FAILURE</button>
                    <button onClick={resetSimulation} className="flex-1 py-1.5 rounded text-[9px] font-bold bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700">RESET</button>
                </div>`;

const newBlock = `<button onClick={resetSimulation} className="w-full mb-2 py-1.5 rounded text-[9px] font-bold bg-slate-800/50 border border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white transition-all">RESET SIMULATION</button>`;

content = content.replace(oldBlock, newBlock);

fs.writeFileSync(file, content);
console.log('Removed Test Beacon Failure and expanded Reset button');
