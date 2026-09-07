with open("src/pages/Explore.tsx", "r") as f:
    content = f.read()

old_block = """                {/* DOUBLE MESH BACKGROUND OVERLAYS - User wants to solve this to a single mesh */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>"""

new_block = """                {/* SINGLE MESH BACKGROUND OVERLAY */}
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>"""

content = content.replace(old_block, new_block)

with open("src/pages/Explore.tsx", "w") as f:
    f.write(content)
