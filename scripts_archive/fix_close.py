with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

target = """                  '+Anomaly'
                }</span>
              </div>
            </div>
          </div>

        </div>
      </div>"""

replacement = """                  '+Anomaly'
                }</span>
              </div>
            </div>
          </div>
          )}

        </div>
      </div>"""

code = code.replace(target, replacement)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
