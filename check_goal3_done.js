const fs = require('fs');
const file = 'c:/Users/User/wipsmaster/WIPA/goal3.md';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/- \[ \] (\d{1,3})\./g, (match, p1) => {
    const num = parseInt(p1);
    if (num >= 71 && num <= 115) {
        return `- [x] [100%] ` + p1 + `.`;
    }
    return match;
});

fs.writeFileSync(file, content);
