const fs = require('fs');
let file = 'frontend/src/components/IotBeaconsPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldContainer = '<div className="absolute bottom-8 left-[360px] right-8 flex justify-between items-end pointer-events-none">';
const newContainer = '<div className="absolute flex justify-between items-end pointer-events-none" style={{ left: "380px", right: "32px", bottom: "32px" }}>';

content = content.replace(oldContainer, newContainer);

fs.writeFileSync(file, content);
console.log('Fixed Tailwind arbitrary class issue');
