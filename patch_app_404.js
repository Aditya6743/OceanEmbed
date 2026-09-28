const fs = require('fs');
let file = 'frontend/src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import NotFound from')) {
    content = content.replace(
        "import Solutions from './pages/Solutions';",
        "import Solutions from './pages/Solutions';\nimport NotFound from './pages/NotFound';"
    );
}

if (!content.includes('<Route path="*"')) {
    content = content.replace(
        '<Route path="/solutions" element={<Solutions />} />',
        '<Route path="/solutions" element={<Solutions />} />\n              <Route path="*" element={<NotFound />} />'
    );
}

fs.writeFileSync(file, content);
console.log('App.tsx patched with 404 route');
