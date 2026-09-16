import re
with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

# I will just remove the stray `)}` at the end of the left panel (line 559)
# Actually, the error is at 559. Let's see what is exactly at 559.
# It is `          )}\n\n        </div>\n      </div>`
# But wait, does it actually close a valid `{`?
# Let's count braces or just manually fix.
code = code.replace("              </div>\n            </div>\n          </div>\n          )}\n\n        </div>", "              </div>\n            </div>\n          </div>\n\n        </div>")

# For rotation button:
rot_end = """              <Unlock size={12} className="text-sky-300" />
            )}
          </button>
        </div>
        )}"""
code = code.replace(rot_end, rot_end.replace("        )}\n", ""))
code = code.replace("        </div>\n        )}", "        </div>\n")
code = code.replace("        </Canvas>\n        )}", "        </Canvas>\n")

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
