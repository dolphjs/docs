### Socket IO

Dolph supports [Socket.Io](https://www.npmjs.com/package/socket.io) and `Ws` for websocket but currently doesn't have out-of-the-box websocket utility for either. Hence, implementing websockets would be similar as you would do in **express** for now.

server.ts file:
```typescript
import { Server } from 'socket.io';

const dolph = new DolphFactory([AppComponent]);

const server = dolph.start();

const initSocket = () => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (client) => {
    console.log(client.id);
    io.emit('user-connected', client.id);
  });
};

initSocket();
```

The above code is a basic example of how to use **socket.io** with Dolph