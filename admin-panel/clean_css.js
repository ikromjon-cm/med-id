const fs = require('fs');
let c = fs.readFileSync('src/app/globals.css', 'utf8');
c = c.replace(/\.dark\s*{[^}]*}/g, '');
c = c.replace(/\.dark\s+\.[a-zA-Z0-9_-]+\s*{[^}]*}/g, '');
c = c.replace(/@custom-variant dark[^;]+;/g, '@custom-variant dark (&:where(.NEVER_APPLY_DARK_MODE));');
c = c.replace(/--color-sidebar-dark:[^;]+;/g, '');
c = c.replace(/--color-[a-zA-Z0-9_-]+-dark:[^;]+;/g, '');
fs.writeFileSync('src/app/globals.css', c);
console.log('Cleaned globals.css');
