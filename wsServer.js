const http = require('http');
const WebSocket = require('ws');
const url = require('url');
const server = http.createServer();
const socketSchemes = require('./socketSchemes');

socketSchemes.map(scheme => {
  scheme.wss = new WebSocket.Server({ noServer: true });
  scheme.wss.on('connection', function connection(ws) {
    console.log('\x1b[36m%s\x1b[0m', `connected ws: "${scheme.path.toString()}"`);

    /* simulation of establishing connection  */
    ws.send(JSON.stringify(scheme.onOpen()));

    /* simulation of updating data  */
    if (scheme.messages) {
      scheme.messages.forEach(event => {
        setTimeout(() => ws.send(JSON.stringify(event.message)), event.timeout)
      });
    } else { // default update after 2 seconds
      setTimeout(() => ws.send(JSON.stringify(scheme.onMessage())), 2000);
    }

    /* simulation of negotiation btw browser and server connections  */
    ws.on('message', function incoming(message) {
      console.log('\x1b[36m%s\x1b[0m', `ws receive message "${scheme.path.toString()}": ${message}`);
      ws.send(JSON.stringify(scheme.onMessage(message)));
    });

    ws.on('close', function incoming(message) {
      console.log('\x1b[36m%s\x1b[0m', `closed ws: "${scheme.path.toString()}"`);
      ws.close(1000);
    });

  });
});

server.on('upgrade', function upgrade(request, socket, head) {
  const pathname = url.parse(request.url).pathname;
  const matched = [];

  socketSchemes.forEach(scheme => {
    const pathRegExp = 'string' === typeof scheme.path ? new RegExp(`^${scheme.path}$`) : scheme.path;

    if (!pathRegExp.test(pathname) || matched.indexOf(scheme.path.toString()) >= 0) {
      return;
    }
    const params = pathname.match(scheme.path);
    matched.push(scheme.path.toString());

    const decoratedOnOpen = scheme.onOpen;
    scheme.onOpen = function () {
      return decoratedOnOpen.apply(scheme, params.slice(1, params.length));
    };

    const decoratedOnMessage = scheme.onMessage;
    scheme.onMessage = function (event) {
      return decoratedOnMessage.apply(scheme, [...params.slice(1, params.length), event]);
    };
    scheme.wss.handleUpgrade(request, socket, head, ws => {
      scheme.wss.emit('connection', ws, request);
    });
  });

  if (!matched.length) {
    socket.destroy();
  }
});

server.listen(3031, function () {
  console.log('\x1b[33m%s\x1b[0m', 'WS Server is running!');
});
