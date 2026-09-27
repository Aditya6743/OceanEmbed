const fs = require('fs');
let file = 'frontend/src/components/IotBeaconsPanel.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

// We know the error is at line 337 (which is the extra </div> added to IotLeftPanel).
// Let's remove line 337 (index 336).
if (lines[336].includes('</div>') && lines[337].includes(');') && lines[338].includes('};')) {
    lines.splice(336, 1);
} else {
    // Search for the first occurrence of "</div>\n    </div>\n    );\n};" and change it back to 1 div.
    const text = lines.join('\n');
    const firstOccur = text.replace(/<\/div>\n    <\/div>\n    \);\n\};/, "</div>\n    );\n};");
    fs.writeFileSync(file, firstOccur);
}

if (lines.length > 0 && Array.isArray(lines)) {
   fs.writeFileSync(file, lines.join('\n'));
}

console.log('Fixed line 337');
