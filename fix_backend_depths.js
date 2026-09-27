const fs = require('fs');
let fileBackend = 'backend/app/services/inference.py';
let cBackend = fs.readFileSync(fileBackend, 'utf8');

cBackend = cBackend.replace(
  /DEPTHS = \[0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000\]/g,
  'DEPTHS = [0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 175, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000]'
);

fs.writeFileSync(fileBackend, cBackend);
console.log('Fixed backend DEPTHS array');
