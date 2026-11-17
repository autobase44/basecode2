const http = require('node:http');

const config = require('./qa43092-config.js');

const PORT = Number(process.env.PORT) || 3000;

function renderPage() {
  const heading = config.displayLabel.toUpperCase();

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Base Code E2E</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f6f6f4; color: #1a1a1a; }
    main { text-align: center; }
  </style>
</head>
<body>
  <main>
    <h1 data-testid="e2e-marker">${heading}</h1>
    <p>Test fixture for Base44 Base Code end-to-end tests.</p>
  </main>
</body>
</html>`;
}

http
  .createServer((req, res) => {
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('{"status":"ok"}');
      return;
    }

    try {
      const page = renderPage();
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(page);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(err && err.message ? err.message : String(err));
    }
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`)); // no host: binds :: (IPv4+IPv6) so a `localhost` healthcheck works
