import re

with open("src/pages/HowItWorks.tsx", "r") as f:
    content = f.read()

# Change delay 0.1 -> 0.5, 0.2 -> 1.5, 0.3 -> 2.5
# And add a keyframe 'lit' flash effect during the animate phase

card1_old = "transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}"
card1_new = "transition={{ duration: 1.0, delay: 0.5, ease: [0.25, 1, 0.5, 1] }}"
content = content.replace(card1_old, card1_new)

card2_old = "transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}"
card2_new = "transition={{ duration: 1.0, delay: 1.5, ease: [0.25, 1, 0.5, 1] }}"
content = content.replace(card2_old, card2_new)

card3_old = "transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}"
card3_new = "transition={{ duration: 1.0, delay: 2.5, ease: [0.25, 1, 0.5, 1] }}"
content = content.replace(card3_old, card3_new)

# Add the 'lighting up' animation
old_animate = "animate={{ opacity: 1, y: 0 }}"
new_animate = "animate={{ opacity: [0, 1, 1], y: [30, 0, 0], scale: [0.95, 1.02, 1], filter: ['brightness(0.5)', 'brightness(1.5)', 'brightness(1)'] }}"
content = content.replace(old_animate, new_animate)

with open("src/pages/HowItWorks.tsx", "w") as f:
    f.write(content)
