const fs = require('fs');

// 1. Frontend Patch
let fileFrontend = 'frontend/src/lib/api.ts';
let cFrontend = fs.readFileSync(fileFrontend, 'utf8');

const regexFrontend = /const spatialVal = \(Math\.sin\(lat \* 0\.2\) \+ Math\.cos\(lon \* 0\.2\) \+ 2\) \/ 4; \/\/ Spatial coherence\n\s*const mld = mldOptions\[Math\.floor\(spatialVal \* 0\.999 \* mldOptions\.length\)\];/;
const replacementFrontend = `const latChunk = Math.round(lat);
    const lonChunk = Math.round(lon);
    const chunkHash = Math.abs(Math.sin(latChunk * 13.37 + lonChunk * 73.19)) * 10000;
    const mld = mldOptions[Math.floor(chunkHash) % mldOptions.length];`;

cFrontend = cFrontend.replace(regexFrontend, replacementFrontend);
fs.writeFileSync(fileFrontend, cFrontend);


// 2. Backend Patch
let fileBackend = 'backend/app/services/inference.py';
let cBackend = fs.readFileSync(fileBackend, 'utf8');

const regexBackend = /spatial_val = \(math\.sin\(lat \* 0\.2\) \+ math\.cos\(lon \* 0\.2\) \+ 2\) \/ 4\n\s*mld_idx = int\(spatial_val \* 0\.999 \* len\(mld_options\)\)/g;
const replacementBackend = `lat_chunk = round(lat)
            lon_chunk = round(lon)
            chunk_hash = abs(math.sin(lat_chunk * 13.37 + lon_chunk * 73.19)) * 10000
            mld_idx = int(chunk_hash) % len(mld_options)`;

cBackend = cBackend.replace(regexBackend, replacementBackend);
fs.writeFileSync(fileBackend, cBackend);

console.log('Fixed grid MLD generation');
