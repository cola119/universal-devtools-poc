#!/usr/bin/env node

import express from 'express';
import http from 'http';
import ws from 'ws';
import path from 'path';
import os from 'os';

const getPrivateIp = () => {
  const ifaces = os.networkInterfaces();
  const ipAddress = Object.values(ifaces)
    .flat()
    .find(
      (iface) => !!iface && iface.family === 'IPv4' && iface.internal === false
    )?.address;
  return ipAddress;
};

const runServer = (
  {
    hostname = 'localhost',
    port = 9222,
    id = process.pid,
    description,
    title,
    url,
  }: {
    hostname?: string;
    port?: number;
    id?: number;
    description: string;
    title: string;
    url: string;
  },
  onListen?: () => void
) => {
  const devInfo = {
    description,
    devtoolsFrontendUrl: `http://${hostname}:${port}`,
    id,
    title: title || 'title',
    type: 'page',
    url,
    webSocketDebuggerUrl: `ws://${hostname}:${port}/universal-devtools`,
  };

  const app = express();
  const server = http.createServer(app);

  app.use('/', express.static(path.resolve(__dirname, '../dist')));

  app.get('/json', (req, res) => {
    res.json([devInfo]);
  });
  app.get('/json/list', (req, res) => {
    res.json([devInfo]);
  });

  server.on('error', (e) => {
    console.log(e);
  });
  server.listen(port, () => {
    if (onListen) onListen();
  });

  const wsServer = new ws.Server({ server });
  wsServer.on('error', (msg) => {
    console.log('error', msg);
  });

  wsServer.on('close', () => {
    console.log('close wsServer');
  });

  wsServer.on('connection', (socket) => {
    const timer = setInterval(() => {
      socket.ping();
    }, 10000);

    console.log('connection');

    socket.on('ping', () => {
      // console.log('ping', data.toString());
    });
    socket.on('pong', () => {
      // console.log('pong', data.toString());
    });
    socket.on('error', (e) => {
      console.log(e);
    });

    socket.on('close', (e) => {
      console.log('close', e);
      clearInterval(timer);
    });

    socket.on('message', (msg) => {
      wsServer.clients.forEach((client) => {
        if (client !== socket) {
          client.send(msg.toString());
        }
      });
    });
  });
};

const main = () => {
  const privateIp = getPrivateIp();

  runServer(
    {
      hostname: privateIp,
      description: 'universal devtools',
      title: process.title || 'Universal DevTools',
      url: '',
    },
    () => {
      console.log(
        `### Universal DevTools ###
Private IP address: ${privateIp}
client: chrome://devtools/bundled/inspector.html?experiments=true&ws=localhost:9222
      : devtools://devtools/bundled/inspector.html?experiments=true&ws=localhost:9222
`
      );
    }
  );
};

main();
