const fs = require('fs');
const path = require('path');

function walk(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
}

walk(path.join(__dirname, 'src'), function(err, results) {
  if (err) throw err;
  const files = results.filter(f => f.endsWith('Sidebar.tsx') || f.endsWith('layout.tsx'));
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const newContent = content.replace(/onClick=\{\(\) => router\.push\('(?:\/login|\/role-selection)'\)\}/g, "onClick={() => { document.cookie = 'medid_role=; path=/; max-age=0'; router.push('/login'); }}");
    if(content !== newContent) {
      fs.writeFileSync(file, newContent, 'utf8');
      console.log('Updated', file);
    }
  });
});
