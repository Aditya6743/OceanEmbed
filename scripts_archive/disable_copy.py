import re

with open("frontend/src/index.css", "r") as f:
    css = f.read()

target = """  body {
    @apply bg-background text-foreground;
  }"""

replacement = """  body {
    @apply bg-background text-foreground select-none;
  }"""

css = css.replace(target, replacement)

with open("frontend/src/index.css", "w") as f:
    f.write(css)
