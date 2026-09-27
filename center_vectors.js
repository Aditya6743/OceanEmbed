const fs = require('fs');
let fileMap = 'frontend/src/components/RoutingSar2DMap.tsx';
let cMap = fs.readFileSync(fileMap, 'utf8');

cMap = cMap.replace(
  /for\(let lat = 10; lat <= 18; lat \+= 1\) \{/g,
  'for(let lat = 8.5; lat <= 17.5; lat += 1) {'
);

fs.writeFileSync(fileMap, cMap);
console.log('Centered vectors');
