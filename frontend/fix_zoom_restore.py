with open("src/pages/Home.tsx", "r") as f:
    content = f.read()

content = content.replace("enableZoom={false}", "enableZoom={true} minDistance={4.8} maxDistance={5.5}")

with open("src/pages/Home.tsx", "w") as f:
    f.write(content)
