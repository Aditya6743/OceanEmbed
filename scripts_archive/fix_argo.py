with open("src/pages/Solutions.tsx", "r") as f:
    code = f.read()

argo_end = """            <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${showGlobeArgo ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
          </button>
        </div>"""

code = code.replace(argo_end, argo_end + "\n        )}")

with open("src/pages/Solutions.tsx", "w") as f:
    f.write(code)
