const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const hostname = '0.0.0.0';
const port = 3000;

const cache = new Map();
const data = fs.readFileSync(path.resolve(__dirname, 'index.html'));
cache.set('/', data);
const js = fs.readFileSync(path.resolve(__dirname, 'index.js'));
cache.set('/index.js', js);

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  const url = new URL(`http://${hostname}${req.url}`);
  const path = url.pathname;
  if (cache.has(path)) res.write(cache.get(path));
  res.end();
});

server.listen(port, hostname, () => {
  const ip = getPrivateIp();
  console.log(`Headless Inspector example is running at http://${ip}:${port}/`);
});

const getPrivateIp = () => {
  const ifaces = os.networkInterfaces();
  const ipAddress = Object.values(ifaces)
    .flat()
    .find(
      (iface) => !!iface && iface.family === 'IPv4' && iface.internal === false
    ).address;
  return ipAddress;
};
