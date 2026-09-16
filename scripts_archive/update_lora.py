import re

with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

# 1. Update Left Panel Text
target_left = "Any cheap, off-the-shelf microchip can connect instantly to receive life-saving alerts."
replacement_left = "Any cheap microchip can receive life-saving alerts globally via <strong className=\"text-rose-400\">LoRaWAN & Satellite Radio</strong> (no WiFi required)."
code = code.replace(target_left, replacement_left)

# 2. Update Terminal Logs
target_log = "> { target: 'all', severity: 'CRITICAL', type: 'CYCLONE' },"
replacement_log = "> { target: 'all', severity: 'CRITICAL', type: 'CYCLONE' },\n      \"> BROADCAST PROTOCOL: LoRaWAN 868MHz / Sat-Com\","
code = code.replace(target_log, replacement_log)

# 3. Update Phone UI
target_phone = "CAT 4 CYCLONE DETECTED<br/>DISTANCE: 42 NM"
replacement_phone = "CAT 4 CYCLONE DETECTED<br/>DISTANCE: 42 NM<br/><span className=\"text-emerald-400\">[ LoRaWAN LINK ]</span>"
code = code.replace(target_phone, replacement_phone)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
