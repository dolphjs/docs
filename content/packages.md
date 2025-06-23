### Packages

DolphJS provides several built-in packages that extend the framework's capabilities for common use cases like events, database connections, real-time communication, file uploads, and in-memory caching.

#### Events Module

The Events module provides an enhanced EventEmitter with priority support:

```typescript
import { EventEmitterService } from '@dolphjs/dolph';

@Service()
export class EventEmitterService extends EventEmitter {
  emitEvent<T extends Array<any>>(eventName: string, ...args: T): boolean {
    return this.emit(eventName, ...args);
  }

  onEvent<T extends (...args: any[]) => void | boolean>(
    eventName: string,
    listener: T,
    priority: number = 0,
    once: boolean = false,
  ): void {
    if (once) {
      this.once(eventName, listener);
    } else {
      this.on(eventName, listener);
    }
  }
}

// Usage example
const eventService = new EventEmitterService();
eventService.onEvent('user.created', (userData) => {
  console.log('User created:', userData);
}, 1); // Priority 1

eventService.emitEvent('user.created', { id: 1, name: 'John' });
```

#### MongoDB Integration

DolphJS provides seamless MongoDB integration using Mongoose:

```typescript
import { initMongo, autoInitMongo } from '@dolphjs/dolph';

// Manual initialization
const mongooseConnection = await initMongo({
  url: 'mongodb://localhost:27017/mydb',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
});

// Auto initialization 
autoInitMongo({
  url: process.env.MONGO_URL || 'mongodb://localhost:27017/mydb'
});
```

#### Socket.io Integration

Real-time communication using Socket.io:

```typescript
import { SocketService } from '@dolphjs/dolph';

export class ChatSocketService extends DolphSocketServiceHandler<Dolph> {
  constructor() {
    super();
    this.initializeSocketEvents();
  }

  private initializeSocketEvents() {
    this.socket?.on('connection', (socket) => {
      socket.on('message', (data) => {
        this.socket?.emit('broadcast', data);
      });
    });
  }
}
```

#### File Upload System

```typescript
import { fileUploader, diskStorage } from '@dolphjs/dolph';

const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

@MediaParser({ 
  fieldname: 'avatar', 
  type: 'single', 
  storage: storage 
})
public async uploadAvatar(req: DRequest, res: DResponse) {
  const { file } = req;
  SuccessResponse({ res, body: { file } });
}
```

#### MemDB (In-Memory Database)

```typescript
import { MemDB } from '@dolphjs/dolph';

const cache = new MemDB<any>();

// Add data
cache.add('user:123', { name: 'John', email: 'john@example.com' });

// Get data
const user = cache.get('user:123');

// Remove data
const removedUser = cache.remove('user:123');

// Clear all data
cache.empty();
```

These packages provide essential functionality for building scalable, real-time applications with proper data persistence, caching, and file handling capabilities. 