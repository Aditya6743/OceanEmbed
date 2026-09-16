with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

# 1. Remove the orphaned `)}` at line 663
# The exact text is:
#         </Canvas>
#       </div>
#       )}
#
#       {activeTab === 'iot' && (
# Wait, let's just replace the whole chunk:
target_chunk = """        </Canvas>
      </div>
      )}

      {activeTab === 'iot' && ("""
replacement_chunk = """        </Canvas>
      )}

      {activeTab === 'iot' && ("""
code = code.replace(target_chunk, replacement_chunk)

# 2. Add the opening `{activeTab !== 'iot' && (` before `<Canvas`
target_canvas = """        <Canvas className="w-full h-full" camera={{ position: [0, 0, 5.35], fov: 45 }} dpr={[1, 2]} performance={{ min: 0.5 }}>"""
replacement_canvas = """        {activeTab !== 'iot' && (
        <Canvas className="w-full h-full" camera={{ position: [0, 0, 5.35], fov: 45 }} dpr={[1, 2]} performance={{ min: 0.5 }}>"""
code = code.replace(target_canvas, replacement_canvas)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
