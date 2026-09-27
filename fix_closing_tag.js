const fs = require('fs');
const file = 'frontend/src/components/landing/ArchitectureSection.tsx';
let content = fs.readFileSync(file, 'utf8');

// Find </svg> and replace with </svg></div>
content = content.replace(/<\/svg>\n\s*<\/div>/g, '</svg>\n        </div>\n      </div>');

fs.writeFileSync(file, content);
console.log('Fixed closing tag');
