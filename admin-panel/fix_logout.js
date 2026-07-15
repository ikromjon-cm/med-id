const fs = require('fs');
const path = require('path');
function walk(d) {
  let res = [];
  const list = fs.readdirSync(d);
  for (let f of list) {
    f = path.join(d, f);
    const stat = fs.statSync(f);
    if (stat.isDirectory()) res = res.concat(walk(f));
    else res.push(f);
  }
  return res;
}
const files = walk('src/app').filter(f => f.endsWith('layout.tsx'));
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/router\.push\('(?:\/login|\/role-selection)'\)/g, "window.location.href='/login'");
  fs.writeFileSync(f, c);
  console.log('Fixed', f);
});
