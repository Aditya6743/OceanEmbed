const fs = require('fs');

// 1. Frontend Patch
let fileFrontend = 'frontend/src/lib/api.ts';
let cFrontend = fs.readFileSync(fileFrontend, 'utf8');

const regexFrontend = /const mldOptions = \[75, 100, 125, 150, 175, 200\];\n\s*const mld = mldOptions\[Math\.floor\(rnd\(100\) \* mldOptions\.length\) % mldOptions\.length\];/;
const replacementFrontend = `const mldOptions = [75, 100, 125, 150, 175, 200];
    const spatialVal = (Math.sin(lat * 0.2) + Math.cos(lon * 0.2) + 2) / 4; // Spatial coherence
    const mld = mldOptions[Math.floor(spatialVal * 0.999 * mldOptions.length)];`;

cFrontend = cFrontend.replace(regexFrontend, replacementFrontend);
fs.writeFileSync(fileFrontend, cFrontend);


// 2. Backend Patch
let fileBackend = 'backend/app/services/inference.py';
let cBackend = fs.readFileSync(fileBackend, 'utf8');

const regexBackend = /mld_idx = int\(abs\(math\.sin\(lat \* 12\.0 \+ lon \* 78\.0\)\) \* len\(mld_options\)\) % len\(mld_options\)/g;
const replacementBackend = `spatial_val = (math.sin(lat * 0.2) + math.cos(lon * 0.2) + 2) / 4
                mld_idx = int(spatial_val * 0.999 * len(mld_options))`;

cBackend = cBackend.replace(regexBackend, replacementBackend);
// In backend, there was an indent issue if we globally replace. The replacement string just replaces the line, so indentation of the original line prefix is lost if not careful. Wait, I didn't include the leading spaces in the regex.
fs.writeFileSync(fileBackend, cBackend);

console.log('Fixed spatial MLD generation');
