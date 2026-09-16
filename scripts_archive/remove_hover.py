import re

with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

# Isolate the IotHubDashboard
target_hub = re.search(r"// ----------------------------------------------------\n// IOT HUB DASHBOARD \(ARCHITECTURE FLOW & RADAR\)\n// ----------------------------------------------------\nconst IotHubDashboard = \(\) => \{\n.*?  \)\n\}\n", code, re.DOTALL).group(0)

# Remove all group-hover: and hover: classes
clean_hub = re.sub(r'group-hover:\S+', '', target_hub)
clean_hub = re.sub(r'hover:\S+', '', clean_hub)
# Clean up extra spaces
clean_hub = re.sub(r'\s+', ' ', clean_hub)
# But wait, replacing \s+ with ' ' removes all newlines and ruins formatting!
# Let's do it safely:
def clean_line(line):
    line = re.sub(r'group-hover:\S+', '', line)
    line = re.sub(r'hover:\S+', '', line)
    line = re.sub(r'cursor-pointer', '', line)
    line = re.sub(r'group\b', '', line)  # remove 'group' class safely
    line = re.sub(r'transition-colors', '', line)
    line = re.sub(r'transition-all', '', line)
    line = re.sub(r'transition-transform', '', line)
    # clean up multiple spaces
    line = re.sub(r' +', ' ', line)
    return line

lines = target_hub.split('\n')
clean_lines = [clean_line(l) for l in lines]
clean_hub = '\n'.join(clean_lines)

code = code.replace(target_hub, clean_hub)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
