const fs = require('fs');
let file = 'frontend/src/components/RoutingSar2DMap.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldTileLayer = /<TileLayer\n\s*url="https:\/\/{s}\.basemaps\.cartocdn\.com\/dark_all\/\{z\}\/\{x\}\/\{y\}\{r\}\.png"\n\s*attribution='&copy; OpenStreetMap &copy; CARTO'\n\s*\/>/;

const newTileLayer = '<TileLayer url="https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}" className="google-dark-terrain" attribution="&copy; Google Maps" />';

content = content.replace(oldTileLayer, newTileLayer);

fs.writeFileSync(file, content);
console.log('Fixed TileLayer');
