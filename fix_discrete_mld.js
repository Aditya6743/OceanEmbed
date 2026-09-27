const fs = require('fs');

// 1. Frontend Patch
let fileFrontend = 'frontend/src/lib/api.ts';
let cFrontend = fs.readFileSync(fileFrontend, 'utf8');

const regexFrontend = /let finalMLD = 75 \+ rnd\(100\) \* 125;\n\s*const mld = Math\.round\(Math\.max\(75, Math\.min\(200, finalMLD\)\)\);/;
const replacementFrontend = `const mldOptions = [75, 100, 125, 150, 175, 200];
    const mld = mldOptions[Math.floor(rnd(100) * mldOptions.length) % mldOptions.length];`;

cFrontend = cFrontend.replace(regexFrontend, replacementFrontend);
fs.writeFileSync(fileFrontend, cFrontend);


// 2. Backend Patch
let fileBackend = 'backend/app/services/inference.py';
let cBackend = fs.readFileSync(fileBackend, 'utf8');

// The python file has two occurrences:
const regexBackend1 = /mld = int\(75 \+ abs\(math\.sin\(lat \* 12\.0 \+ lon \* 78\.0\)\) \* 125\.0\)\n\s*mld = max\(75, min\(200, mld\)\)/g;

const replacementBackend = `mld_options = [75, 100, 125, 150, 175, 200]
                mld_idx = int(abs(math.sin(lat * 12.0 + lon * 78.0)) * len(mld_options)) % len(mld_options)
                mld = mld_options[mld_idx]`;

// Let's do it cleanly using string replace
cBackend = cBackend.replace(regexBackend1, replacementBackend);
fs.writeFileSync(fileBackend, cBackend);

console.log('Fixed discrete MLD generation');
