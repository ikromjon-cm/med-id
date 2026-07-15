const fs = require('fs');
const path = require('path');
function walk(d) {
  let res = [];
  const list = fs.readdirSync(d);
  for (let f of list) {
    f = path.join(d, f);
    if (fs.statSync(f).isDirectory()) res = res.concat(walk(f));
    else res.push(f);
  }
  return res;
}
const files = walk('src').filter(f => f.endsWith('.tsx'));
let changed = 0;
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  const orig = c;
  c = c.replace(/dark:bg-\[\#0F0F15\]/g, '');
  c = c.replace(/dark:bg-gray-900/g, '');
  c = c.replace(/dark:bg-\[\#13131A\]/g, '');
  if (c !== orig) {
    fs.writeFileSync(f, c);
    changed++;
  }
});
console.log('Removed dark backgrounds from ' + changed + ' files.');
