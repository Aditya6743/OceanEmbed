import re

with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

# Make Top Half (Radar) take 35%
code = code.replace(
    '{/* ----------------- TOP HALF: RADAR & TELEMETRY ----------------- */}\n      <div className="flex-1 bg-black/60',
    '{/* ----------------- TOP HALF: RADAR & TELEMETRY ----------------- */}\n      <div className="h-[35%] shrink-0 bg-black/60'
)

# Make Bottom Half (Architecture) take 65% and scale it up
code = code.replace(
    '{/* ----------------- BOTTOM HALF: ARCHITECTURE FLOW ----------------- */}\n      <div className="flex-1 w-full',
    '{/* ----------------- BOTTOM HALF: ARCHITECTURE FLOW ----------------- */}\n      <div className="flex-1 h-[60%] w-full'
)

# Scale up Core Intelligence (w-80 -> w-96)
code = code.replace(
    '<div className="z-10 flex flex-col items-center gap-3 w-80',
    '<div className="z-10 flex flex-col items-center gap-4 w-[26rem]'
)
# Scale up Terminal inside Core Intelligence (h-40 -> h-48)
code = code.replace(
    '<div className="h-40 bg-[#050505] p-4 flex flex-col',
    '<div className="h-48 bg-[#050505] p-5 flex flex-col'
)
# Make Data Source wider
code = code.replace(
    '<div className="z-10 flex flex-col items-center gap-3 w-52 transform',
    '<div className="z-10 flex flex-col items-center gap-4 w-60 transform'
)
# Make Gateway wider
code = code.replace(
    '<div className="z-10 flex flex-col items-center gap-3 w-52 transform',
    '<div className="z-10 flex flex-col items-center gap-4 w-60 transform'
)
# Make Endpoints wider
code = code.replace(
    '<div className="z-10 flex flex-col gap-5 w-72 relative">',
    '<div className="z-10 flex flex-col gap-6 w-80 relative">'
)
# Increase bracket size connecting Gateway to Endpoints
code = code.replace(
    'w-12 h-[210px] -translate-y-1/2',
    'w-14 h-[250px] -translate-y-1/2'
)
code = code.replace(
    'w-12 h-[3px] bg-slate-700',
    'w-14 h-[3px] bg-slate-700'
)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
