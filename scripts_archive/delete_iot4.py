with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

# Remove the {activeTab !== 'iot' && ( ... )} wrappers
code = code.replace("{activeTab !== 'iot' && (\n", "")
# This leaves trailing `)}` that we have to clean up.
code = code.replace("          </button>\n        </div>\n        )}", "          </button>\n        </div>")
code = code.replace("        </Canvas>\n        )}", "        </Canvas>")

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
