const fs = require('fs');

function fixFile(file, divRefToReplace, canvasOpenRegex) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('setEventTarget')) return;

  const useStateStr = 'const [eventTarget, setEventTarget] = React.useState<HTMLElement | null>(null);\n  ';
  content = content.replace(divRefToReplace, useStateStr + divRefToReplace);
  
  content = content.replace(/ref=\{[a-zA-Z0-9]+\}/, 'ref={setEventTarget}');
  // Wait, replacing the FIRST ref is dangerous. Let's do it manually.
}
