/* eslint-disable no-param-reassign,no-console */
import * as WebSocket from 'ws';
import jwt from 'jsonwebtoken';
import config from './config/db';
import configlobal from './config/global';
// import server from './app';

const wss = new WebSocket.Server({ port: configlobal.portwss });

function toEvent(message) {
  try {
    const event = JSON.parse(message);
    this.emit(event.type, event.payload);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('Not an event JSON');
  }
}

wss.on('connection', ws => {
  ws.on('message', toEvent)
    .on('authenticate', data => {
      jwt.verify(data.token, config.secret, (err, decoded) => {
        if (err) {
          ws.send(JSON.stringify({ success: false, msg: err }));
          return ws.terminate();
        }
        ws.user = decoded;
        ws.isAlive = true;
        ws.send(JSON.stringify({ success: true, logged: true }));
        return null;
      });
    })
    .on('hello', () => {
      if (!ws.user) return ws.terminate();
      ws.send(ws.user.email);
      return null;
    })
    .on('lobbyMessage', data => {
      wss.clients.forEach(client => {
        if (ws.isAlive && ws.user && client.user.email !== ws.user.email) {
          client.send(JSON.stringify({ type: 'lobbyMessage', payload: data }));
        }
        return null;
      });
    });

  ws.on('pong', () => {
    if (ws.user) console.log('ALIVE :', ws.user.email);
    ws.isAlive = true;
  });

  ws.send(JSON.stringify({ success: true, msg: 'echo-protocol' }));
});

if (process.env.NODE_ENV === 'production') {
  setInterval(() => {
    wss.clients.forEach(ws => {
      if (!ws.isAlive) {
        if (ws.user) console.log('IS DEAD :', ws.user.email);
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping(null, false, true);
      return null;
    });
  }, 10000);
}

export default wss;
