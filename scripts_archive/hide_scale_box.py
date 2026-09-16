import re

with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

target = """          {/* ML Telemetry Status & Legend */}
          <div className="mt-auto pt-4 border-t border-slate-800 pb-4">"""

replacement = """          {/* ML Telemetry Status & Legend */}
          {activeTab !== 'iot' && (
          <div className="mt-auto pt-4 border-t border-slate-800 pb-4">"""

code = code.replace(target, replacement)

target2 = """                  '+Anomaly'
                }</span>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* 3D Visualization (Right Panel 65%) */}"""

replacement2 = """                  '+Anomaly'
                }</span>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>


      {/* 3D Visualization (Right Panel 65%) */}"""

code = code.replace(target2, replacement2)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
