const fs = require('fs');
const file = 'c:/Users/User/wipsmaster/WIPA/goal2.md';
let content = fs.readFileSync(file, 'utf8');

// The format we are matching is: - [x] [100%] 609. Smoke test... or - [x] 609. Smoke test...
content = content.replace(/- \[x\] (?:\[100%\] )?(\d{3,})\./g, (match, p1) => {
    const num = parseInt(p1);
    if (num >= 373 && num <= 617) {
        return `- [ ] ` + p1 + `.`;
    }
    return match;
});

fs.writeFileSync(file, content);
