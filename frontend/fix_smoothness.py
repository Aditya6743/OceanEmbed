import re

with open("src/pages/Home.tsx", "r") as f:
    content = f.read()

# Make globe heavier and smoother in Home
content = content.replace("dampingFactor={0.075}", "dampingFactor={0.03}")
content = content.replace("rotateSpeed={0.8}", "rotateSpeed={0.4}")
content = content.replace("autoRotateSpeed={0.3}", "autoRotateSpeed={0.2}")

with open("src/pages/Home.tsx", "w") as f:
    f.write(content)

with open("src/pages/Explore.tsx", "r") as f:
    explore_content = f.read()

# Make globe heavier and smoother in Explore
explore_content = explore_content.replace("dampingFactor={0.05}", "dampingFactor={0.03}")
explore_content = explore_content.replace("rotateSpeed={0.5}", "rotateSpeed={0.4}")
explore_content = explore_content.replace("autoRotateSpeed={0.5}", "autoRotateSpeed={0.2}")
# Ensure smooth scrolling for the right panel container
explore_content = explore_content.replace('className="w-full lg:w-[65%] h-full relative z-20 overflow-y-auto"', 'className="w-full lg:w-[65%] h-full relative z-20 overflow-y-auto scroll-smooth"')

with open("src/pages/Explore.tsx", "w") as f:
    f.write(explore_content)

with open("src/App.tsx", "r") as f:
    app_content = f.read()

# Make Lenis global scroll even smoother
app_content = app_content.replace("lerp: 0.05, duration: 1.5", "lerp: 0.04, duration: 1.8")

with open("src/App.tsx", "w") as f:
    f.write(app_content)

