with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

target = """            </Suspense>
        </Canvas>
      )}

      {activeTab === 'iot' && ("""

replacement = """            </Suspense>
        </Canvas>
      )}
      </div>

      {activeTab === 'iot' && ("""
code = code.replace(target, replacement)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
