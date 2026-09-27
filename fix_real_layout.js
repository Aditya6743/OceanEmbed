const fs = require('fs');
let file = 'frontend/src/components/IotBeaconsPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

// The current container has a style={{ left: '350px' }} which is disastrous because it's already in a 55% container.

const oldContainer = `<div className="absolute top-0 bottom-8 right-8 flex justify-between items-end pointer-events-none" style={{ left: '350px' }}>`;

const newContainer = `<div className="absolute bottom-10 left-8 right-12 flex justify-between items-end pointer-events-none">`;

content = content.replace(oldContainer, newContainer);

fs.writeFileSync(file, content);
console.log('Fixed container width context');
