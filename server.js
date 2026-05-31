const http = require('http');
const fs   = require('fs');
const path = require('path');
const url  = require('url');

const PORT = 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.json': 'application/json', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.gif': 'image/gif', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.webp': 'image/webp', '.yml': 'text/yaml',
};

http.createServer((req, res) => {
  const pathname = url.parse(req.url).pathname;

  // Save content API
  if (req.method === 'POST' && pathname === '/api/save-content') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        fs.writeFileSync(path.join(ROOT, 'content.json'), JSON.stringify(data, null, 2));
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ success: true }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // Resolve file path
  let filePath = path.join(ROOT, pathname === '/' ? 'index.html' : pathname);
  if (pathname === '/admin' || pathname === '/admin/') filePath = path.join(ROOT, 'admin', 'index.html');

  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'text/plain' });
    res.end(data);
  });

}).listen(PORT, () => {
  console.log('\n  Pocono Lake Haven — Local Server');
  console.log(`  Site:  http://localhost:${PORT}`);
  console.log(`  Admin: http://localhost:${PORT}/admin`);
  console.log('\n  Press Ctrl+C to stop.\n');
});
