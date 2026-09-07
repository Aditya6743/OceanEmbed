with open("src/pages/Explore.tsx", "r") as f:
    content = f.read()

# Remove the redundant grid background from the right panel
old_grid = """        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />"""

content = content.replace(old_grid, "")

with open("src/pages/Explore.tsx", "w") as f:
    f.write(content)
