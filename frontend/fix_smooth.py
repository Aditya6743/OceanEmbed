import re

with open("src/components/Preloader.tsx", "r") as f:
    content = f.read()

# Remove the shockwave DOM elements entirely
dom_pattern = r'\{\/\* Premium Multi-Layer Shockwave \*\/\}.*?\{\/\* Cinematic HUD Overlay \*\/\}'
content = re.sub(dom_pattern, '{/* Cinematic HUD Overlay */}', content, flags=re.DOTALL)

# Remove the shockwave CSS entirely
css_pattern = r'\/\* SUBTLE SHOCKWAVE ANIMATIONS \*\/.*?(?=\<\/style\>)'
content = re.sub(css_pattern, '', content, flags=re.DOTALL)

# Make the block light-up transition even smoother (from 0.2s to 0.5s)
content = content.replace('transition: all 0.2s ease;', 'transition: all 0.5s ease;')

# Remove the "wait briefly" timeout since there's no shockwave to wait for, 
# making the fade to the app immediately smooth.
content = content.replace('setTimeout(() => setIsFadingOut(true), 350); // wait briefly to show premium shockwave', 'setTimeout(() => setIsFadingOut(true), 50);')
content = content.replace('setTimeout(() => onComplete(), 1050); // fade transition', 'setTimeout(() => onComplete(), 750);')

with open("src/components/Preloader.tsx", "w") as f:
    f.write(content)
