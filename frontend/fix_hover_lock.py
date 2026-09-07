import re

with open("src/pages/HowItWorks.tsx", "r") as f:
    content = f.read()

# Add sequenceComplete state
content = content.replace(
    "const [activeCard, setActiveCard] = useState<number | null>(null);",
    "const [activeCard, setActiveCard] = useState<number | null>(null);\n  const [sequenceComplete, setSequenceComplete] = useState(false);"
)

# Update the final timeout to set sequenceComplete to true
content = content.replace(
    "const t4 = setTimeout(() => setActiveCard(null), 3800);",
    "const t4 = setTimeout(() => {\n      setActiveCard(null);\n      setSequenceComplete(true);\n    }, 3800);"
)

# Remove the premature hover-cancel
content = content.replace("onMouseEnter={() => setActiveCard(null)}", "")

# Add pointer-events-none to disable hovering during the sequence
old_class_start = "className={`group relative flex flex-col rounded-3xl overflow-hidden backdrop-blur-2xl border transition-all duration-500"
new_class_start = "className={`group relative flex flex-col rounded-3xl overflow-hidden backdrop-blur-2xl border transition-all duration-500 ${!sequenceComplete ? 'pointer-events-none' : ''}"

content = content.replace(old_class_start, new_class_start)

with open("src/pages/HowItWorks.tsx", "w") as f:
    f.write(content)
