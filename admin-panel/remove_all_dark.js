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
const files = walk('src').filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));
let changed = 0;
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  const orig = c;
  // Safely remove any class starting with dark:
  // e.g., dark:bg-[#0F0F15], dark:hover:text-white, dark:text-gray-400
  c = c.replace(/dark:[a-zA-Z0-9_\-\/\[\]#:]+/g, '');
  if (c !== orig) {
    fs.writeFileSync(f, c);
    changed++;
  }
});
console.log('Removed all dark variants securely from ' + changed + ' files.');
