with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace("import { ReactLenis } from '@studio-freight/react-lenis';", "import { ReactLenis } from 'lenis/react';")

with open("src/App.tsx", "w") as f:
    f.write(content)
