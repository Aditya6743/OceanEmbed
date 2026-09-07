with open("src/App.tsx", "r") as f:
    content = f.read()

import_statement = """import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReactLenis } from '@studio-freight/react-lenis';"""

content = content.replace("import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';", import_statement)

wrapper_start = """  return (
    <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothWheel: true }}>
      <Router>"""

content = content.replace("  return (\n    <Router>", wrapper_start)

wrapper_end = """      </Router>
    </ReactLenis>
  );"""

content = content.replace("    </Router>\n  );", wrapper_end)

with open("src/App.tsx", "w") as f:
    f.write(content)
