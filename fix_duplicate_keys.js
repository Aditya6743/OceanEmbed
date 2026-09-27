const fs = require('fs');
let file = 'frontend/src/components/RoutingSar2DMap.tsx';
let content = fs.readFileSync(file, 'utf8');

const vesselOld = `  const vesselIcon = L.divIcon({
    className: '',
    iconSize: null as any,
    html: '<div style="width:16px;height:16px;background:white;border:2px solid #333;transform:rotate(45deg);box-shadow:0 0 10px rgba(0,0,0,0.5);"></div>',
    iconSize: [16, 16],`;

const vesselNew = `  const vesselIcon = L.divIcon({
    className: '',
    html: '<div style="width:16px;height:16px;background:white;border:2px solid #333;transform:rotate(45deg);box-shadow:0 0 10px rgba(0,0,0,0.5);"></div>',
    iconSize: [16, 16],`;

const lkpOld = `  const lkpIcon = L.divIcon({
    className: '',
    iconSize: null as any,
    html: '<div style="width:14px;height:14px;background:#f43f5e;border-radius:50%;box-shadow:0 0 15px #f43f5e;animation:pulse 2s infinite;"></div>',
    iconSize: [14, 14],`;

const lkpNew = `  const lkpIcon = L.divIcon({
    className: '',
    html: '<div style="width:14px;height:14px;background:#f43f5e;border-radius:50%;box-shadow:0 0 15px #f43f5e;animation:pulse 2s infinite;"></div>',
    iconSize: [14, 14],`;

content = content.replace(vesselOld, vesselNew);
content = content.replace(lkpOld, lkpNew);

fs.writeFileSync(file, content);
console.log('Fixed duplicate keys');
