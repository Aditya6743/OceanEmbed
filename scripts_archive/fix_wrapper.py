with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

bad_wrapper = """            <div className="mt-auto pt-4 border-t border-slate-800 pb-4">
            <div className="mt-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Data Scale</span>"""

good_wrapper = """            <div className="mt-auto pt-4 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Data Scale</span>"""

if bad_wrapper in code:
    code = code.replace(bad_wrapper, good_wrapper)
    with open("frontend/src/pages/Solutions.tsx", "w") as f:
        f.write(code)
    print("Fixed wrapper!")
else:
    print("Wrapper not found")
