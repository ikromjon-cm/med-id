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
  // Match any dark: class including dark:hover:xxx, dark:focus:xxx, dark:text-white/50, dark:bg-[...], etc.
  c = c.replace(/dark:(?:hover:|focus:|active:|group-hover:)?(?:[a-zA-Z0-9_-]+|\[[^\]]+\])(?:\/[0-9]+)?/g, '');
  if (c !== orig) {
    fs.writeFileSync(f, c);
    changed++;
  }
});
console.log('Removed all dark variants from ' + changed + ' files.');
