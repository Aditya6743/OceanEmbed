import re

with open("src/components/Navbar.tsx", "r") as f:
    content = f.read()

old_nav = """  const navLinks: Array<{ name: string; id: string; path?: string }> = [
    { name: 'Data', id: 'data' },
    { name: 'Model', id: 'model' },
    { name: 'About', id: 'about' },
  ];"""

new_nav = """  const navLinks: Array<{ name: string; id: string; path?: string }> = [
    { name: 'Vision', id: 'vision', path: '/how-it-works' },
    { name: 'Data', id: 'data' },
    { name: 'Model', id: 'model' },
    { name: 'About', id: 'about' },
  ];"""

content = content.replace(old_nav, new_nav)

with open("src/components/Navbar.tsx", "w") as f:
    f.write(content)
