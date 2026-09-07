with open("src/pages/Home.tsx", "r") as f:
    content = f.read()

replacement = """      </section>

      {/* SEAMLESS TRANSITION GRADIENT */}
      <div className="w-full h-[35vh] bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none relative z-10"></div>

      {/* MODULAR LANDING PAGE SECTIONS */}
      <div className="relative w-full bg-transparent -mt-[15vh] z-20">"""

content = content.replace('      </section>\n\n      {/* MODULAR LANDING PAGE SECTIONS */}\n      <div className="relative w-full bg-transparent">', replacement)

with open("src/pages/Home.tsx", "w") as f:
    f.write(content)
