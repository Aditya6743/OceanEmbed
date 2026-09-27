const fs = require('fs');
let file = 'frontend/src/components/IotBeaconsPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldFlexContainer = `<div className="absolute flex justify-between items-end pointer-events-none" style={{ left: "380px", right: "32px", bottom: "32px" }}>
                
                {/* Bottom Left: Fisherman Device */}
                <div className="pointer-events-auto">
                    <div className={\`w-72`;

const newIndependentPositions = `
                {/* Bottom Left: Fisherman Device */}
                <div className="absolute pointer-events-auto" style={{ left: "380px", bottom: "32px" }}>
                    <div className={\`w-72`;

content = content.replace(oldFlexContainer, newIndependentPositions);

const middleBlockOld = `
                    </div>
                </div>

                {/* Bottom Right: Coastal Warning Station */}
                <div className="pointer-events-auto">
                    <div className={\`w-72`;

const middleBlockNew = `
                    </div>
                </div>

                {/* Bottom Right: Coastal Warning Station */}
                <div className="absolute pointer-events-auto" style={{ right: "32px", bottom: "32px" }}>
                    <div className={\`w-72`;

content = content.replace(middleBlockOld, middleBlockNew);

// Remove the closing div of the old flex container
const endBlockOld = `
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};`;

const endBlockNew = `
                        </div>
                    </div>
                </div>
        </div>
    );
};`;
content = content.replace(endBlockOld, endBlockNew);

fs.writeFileSync(file, content);
console.log('Split into independent absolute positioned boxes');
