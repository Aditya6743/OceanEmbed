import re

with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

# 1. Remove IotHubDashboard function completely
code = re.sub(r"// ----------------------------------------------------\n// IOT HUB DASHBOARD \(ARCHITECTURE FLOW & RADAR\)\n// ----------------------------------------------------\nconst IotHubDashboard = \(\) => \{.*?\n\}\n\n", "", code, flags=re.DOTALL)

# 2. Remove Navbar button
code = re.sub(r"\s*<button\n\s*onClick=\{.*?setActiveTab\('iot'\)\}\n\s*className=\{.*?activeTab === 'iot'.*?\n\s*>\n\s*<Radio size=\{12\}.*?IOT BEACONS\n\s*</button>", "", code, flags=re.DOTALL)

# 3. Remove Left Panel IoT content
code = re.sub(r"\s*\{activeTab === 'iot' && \(\n\s*<div className=\"flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6\">\n\s*<div className=\"mb-6\">\n\s*<div className=\"flex items-center gap-3 mb-4\">.*?</div>\n\s*\)\}", "", code, flags=re.DOTALL)

# 4. Remove Right Panel IoT rendering
code = re.sub(r"\s*\{activeTab === 'iot' && \(\n\s*<div className=\"absolute inset-0 z-0 pl-\[35%\] pt-20 bg-\[#030712\] flex items-center justify-center overflow-hidden\">\n\s*<div className=\"absolute inset-0 bg-\[linear-gradient.*?</div>\n\s*<IotHubDashboard />\n\s*</div>\n\s*\)\}", "", code, flags=re.DOTALL)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
