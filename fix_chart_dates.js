const fs = require('fs');
let file = 'frontend/src/components/HistoryChart.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldTick = `                // If it's YYYY-MM-DD, parse month
                const parts = val.split('-');
                if (parts.length >= 2) {
                    const monthIdx = parseInt(parts[1]) - 1;
                    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
                    return months[monthIdx] || val;
                }`;

const newTick = `                // If it's YYYY-MM-DD, parse date and month
                const parts = val.split('-');
                if (parts.length >= 3) {
                    const day = parseInt(parts[2]);
                    const monthIdx = parseInt(parts[1]) - 1;
                    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
                    return \`\${day} \${months[monthIdx]}\`;
                }`;

content = content.replace(oldTick, newTick);
fs.writeFileSync(file, content);
console.log('Fixed X-Axis dates in HistoryChart.tsx');
