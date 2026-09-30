const fs = require('fs');
let file = 'frontend/src/components/Navbar.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `  const navLinks: Array<{ name: string; id: string; path?: string }> = [
    { name: 'Data Ingestion', id: 'data' },
    { name: 'Architecture', id: 'architecture', path: '/architecture' },
    { name: 'About', id: 'about' },
    { name: 'Solutions', id: 'mosdac', path: '/solutions' },
  ];`;

const replacement = `  const navLinks: Array<{ name: string; id: string; path?: string }> = [
    { name: 'Vision', id: 'vision', path: '/project-vision' },
    { name: 'Architecture', id: 'architecture', path: '/architecture' },
    { name: 'Explore', id: 'explore', path: '/explore' },
    { name: 'Solutions', id: 'solutions', path: '/solutions' },
  ];`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content);
    console.log('Patched Navbar.tsx with correct routing flow');
} else {
    console.log('Target string not found in Navbar.tsx');
}
