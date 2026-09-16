with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

bad_closing = """                  activeTab === 'cable' ? '30°C' :
                  '+Anomaly'
                }</span>
              </div>
            </div>
          </div>

        </div>
      </div>"""

good_closing = """                  activeTab === 'cable' ? '30°C' :
                  '+Anomaly'
                }</span>
              </div>
          </div>

        </div>
      </div>"""

if bad_closing in code:
    code = code.replace(bad_closing, good_closing)
    with open("frontend/src/pages/Solutions.tsx", "w") as f:
        f.write(code)
    print("Fixed closing!")
else:
    print("Closing not found")
