with open("src/pages/Solutions.tsx", "r") as f:
    code = f.read()

# Fix TCHP > 140
code = code.replace('TCHP > 140 kJ/cm²', 'TCHP {">"} 140 kJ/cm²')

# We need to remove ALL `        )}\n` that were wrongly injected and reinject them properly.
# Actually, it's easier to just strip out all `        )}\n        )}\n` and `        )}\n` and re-evaluate.
# Let's just restore the whole rotation and argo block.
import re

# Remove the broken `)}`
code = code.replace("          </button>\n        </div>\n        )}\n        )}", "          </button>\n        </div>\n        )}")
code = code.replace("          </button>\n        </div>\n        )}", "          </button>\n        </div>")

# Now selectively wrap the Rotation and Argo blocks
rot_start = """        {/* Lock Auto-Rotate Button */}
        <div className="absolute top-24 right-6 z-20 pointer-events-auto">"""
code = code.replace(rot_start, "        {/* Lock Auto-Rotate Button */}\n        {activeTab !== 'iot' && (\n        <div className=\"absolute top-24 right-6 z-20 pointer-events-auto\">")

rot_end = """              <Unlock size={12} className="text-sky-300" />
            )}
          </button>
        </div>"""
code = code.replace(rot_end, rot_end + "\n        )}")

argo_start = """        {/* ARGO HUD Overlay */}
        <div className="absolute top-24 left-6 z-20 pointer-events-auto flex items-center gap-3 bg-black/60 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg">"""
code = code.replace(argo_start, "        {/* ARGO HUD Overlay */}\n        {activeTab !== 'iot' && (\n        <div className=\"absolute top-24 left-6 z-20 pointer-events-auto flex items-center gap-3 bg-black/60 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg\">")

argo_end = """          </button>
        </div>"""
# Since argo_end matches multiple places, let's be more specific
argo_end_specific = """            <Activity size={10} className={showGlobeArgo ? 'text-lime-900' : 'text-slate-400'} />
          </button>
        </div>"""
code = code.replace(argo_end_specific, argo_end_specific + "\n        )}")


with open("src/pages/Solutions.tsx", "w") as f:
    f.write(code)
