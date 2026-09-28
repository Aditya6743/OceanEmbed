const fs = require('fs');

// 1. Rename Component in ProjectVision.tsx
let f1 = 'frontend/src/pages/ProjectVision.tsx';
let c1 = fs.readFileSync(f1, 'utf8');
c1 = c1.replace('export default function HowItWorks() {', 'export default function ProjectVision() {');
fs.writeFileSync(f1, c1);

// 2. App.tsx
let f2 = 'frontend/src/App.tsx';
let c2 = fs.readFileSync(f2, 'utf8');
c2 = c2.replace("import HowItWorks from './pages/HowItWorks';", "import ProjectVision from './pages/ProjectVision';");
c2 = c2.replace('<Route path="/how-it-works" element={<HowItWorks />} />', '<Route path="/project-vision" element={<ProjectVision />} />');
fs.writeFileSync(f2, c2);

// 3. AboutSection.tsx
let f3 = 'frontend/src/components/landing/AboutSection.tsx';
let c3 = fs.readFileSync(f3, 'utf8');
c3 = c3.replace("navigate('/how-it-works')", "navigate('/project-vision')");
fs.writeFileSync(f3, c3);

// 4. Footer.tsx
let f4 = 'frontend/src/components/landing/Footer.tsx';
let c4 = fs.readFileSync(f4, 'utf8');
c4 = c4.replace("path: '/how-it-works'", "path: '/project-vision'");
fs.writeFileSync(f4, c4);

// 5. Home.tsx
let f5 = 'frontend/src/pages/Home.tsx';
let c5 = fs.readFileSync(f5, 'utf8');
c5 = c5.replace("navigate('/how-it-works')", "navigate('/project-vision')");
fs.writeFileSync(f5, c5);

console.log('Renamed routing and navigation references to /project-vision');
