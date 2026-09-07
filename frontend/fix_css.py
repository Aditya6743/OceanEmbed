with open('src/index.css', 'r') as f:
    css = f.read()

css = css.replace('nav, .hidden.md\\:hidden, button', 'nav, .hidden, .md\\:hidden, button')
css = css.replace('.md\\:w-1\\/2', '.md\\\\:w-1\\\\/2')
css = css.replace('.bg-\\[\\#050505\\]', '.bg-\\\\[\\\\#050505\\\\]')

with open('src/index.css', 'w') as f:
    f.write(css)
