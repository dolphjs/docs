### Classes System

DolphJS provides a robust class-based architecture with several base classes that form the foundation of the framework. Understanding these classes is essential for building scalable applications.

#### Core Class Hierarchy

The DolphJS framework is built around several core abstract classes that provide structure and functionality:

- **DolphControllerHandler**: Base class for all controllers
- **DolphServiceHandler**: Base class for all services
- **DolphRouteHandler**: Base class for route handlers
- **DolphSocketServiceHandler**: Base class for socket services

#### DolphControllerHandler

The base class for all controllers in the framework, providing the foundation for HTTP request handling.

```typescript
abstract class DolphControllerHandler<T extends Dolph> {
  // Base controller functionality
  // Framework automatically injects services registered in components
}
```

##### Usage Example

```typescript
import { DolphControllerHandler } from '@dolphjs/dolph';
import { Route, Get, Post, DReq, DRes } from '@dolphjs/dolph';

@Route('users')
export class UserController extends DolphControllerHandler<Dolph> {
  private userService: UserService; // Automatically injected
  
  @Get()
  async getAllUsers(@DReq() req: DRequest, @DRes() res: DResponse) {
    const users = await this.userService.findAll();
    SuccessResponse({ res, body: { users } });
  }

  @Post()
  async createUser(@DReq() req: DRequest, @DRes() res: DResponse) {
    const user = await this.userService.create(req.body);
    SuccessResponse({ res, body: { user }, status: 201 });
  }
}
```

#### DolphServiceHandler

The base class for all services, providing dependency injection capabilities and service management.

```typescript
abstract class DolphServiceHandler<T extends Dolph> {
  public name: string;
  
  constructor(name: T) {
    this.name = name;
  }
}
```

##### Service Implementation

```typescript
import { DolphServiceHandler } from '@dolphjs/dolph';

export class UserService extends DolphServiceHandler<Dolph> {
  private users: User[] = [];

  constructor() {
    super('userService'); // Service name for DI
  }

  async create(userData: CreateUserDto): Promise<User> {
    const user = {
      id: generateId(),
      ...userData,
      createdAt: new Date()
    };
    this.users.push(user);
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async update(id: string, updateData: Partial<User>): Promise<User | null> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    this.users[userIndex] = { ...this.users[userIndex], ...updateData };
    return this.users[userIndex];
  }

  async delete(id: string): Promise<boolean> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;

    this.users.splice(userIndex, 1);
    return true;
  }
}
```

#### DolphRouteHandler

Base class for route handlers using Express routing architecture (alternative to controller-based routing).

```typescript
abstract class DolphRouteHandler<T extends Dolph> {
  abstract path: T;
  abstract initRoutes(): void;
  public router = Router();
  abstract controller: DolphControllerHandler<T>;
}
```

##### Route Handler Implementation

```typescript
import { DolphRouteHandler } from '@dolphjs/dolph';
import { Router } from 'express';

export class UserRoutes extends DolphRouteHandler<'/users'> {
  path = '/users' as const;
  router = Router();
  controller: UserController;

  constructor() {
    super();
    this.controller = new UserController();
    this.initRoutes();
  }

  initRoutes(): void {
    // GET /users
    this.router.get('/', this.controller.getAllUsers.bind(this.controller));
    
    // GET /users/:id
    this.router.get('/:id', this.controller.getUserById.bind(this.controller));
    
    // POST /users
    this.router.post('/', this.controller.createUser.bind(this.controller));
    
    // PUT /users/:id
    this.router.put('/:id', this.controller.updateUser.bind(this.controller));
    
    // DELETE /users/:id
    this.router.delete('/:id', this.controller.deleteUser.bind(this.controller));
  }
}
```

#### DolphSocketServiceHandler

Base class for socket services, providing real-time communication capabilities.

```typescript
abstract class DolphSocketServiceHandler<T extends Dolph> {
  private _socketService?: SocketService;
  public socket?: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

  public get socketService(): SocketService {
    if (!this._socketService) {
      this._socketService = getInjectedService(SocketService.name);
      this.initSocketEvents();
    }
    return this._socketService;
  }

  abstract initSocketEvents(): void;
}
```

##### Socket Service Implementation

```typescript
import { DolphSocketServiceHandler } from '@dolphjs/dolph';

export class ChatSocketService extends DolphSocketServiceHandler<Dolph> {
  private connectedUsers = new Map<string, any>();

  constructor() {
    super();
    this.initSocketEvents();
  }

  initSocketEvents(): void {
    this.socket?.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Handle user joining
      socket.on('join', (userData) => {
        this.connectedUsers.set(socket.id, userData);
        socket.broadcast.emit('user_joined', {
          id: socket.id,
          ...userData
        });
      });

      // Handle messages
      socket.on('send_message', (messageData) => {
        const user = this.connectedUsers.get(socket.id);
        const message = {
          id: generateMessageId(),
          text: messageData.text,
          sender: user,
          timestamp: new Date(),
          roomId: messageData.roomId
        };

        if (messageData.roomId) {
          socket.to(messageData.roomId).emit('receive_message', message);
        } else {
          socket.broadcast.emit('receive_message', message);
        }
      });

      // Handle room management
      socket.on('join_room', (roomId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user_joined_room', {
          userId: socket.id,
          roomId
        });
      });

      socket.on('leave_room', (roomId) => {
        socket.leave(roomId);
        socket.to(roomId).emit('user_left_room', {
          userId: socket.id,
          roomId
        });
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        const user = this.connectedUsers.get(socket.id);
        this.connectedUsers.delete(socket.id);
        socket.broadcast.emit('user_left', {
          id: socket.id,
          ...user
        });
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  // Additional socket methods
  broadcastToRoom(roomId: string, event: string, data: any): void {
    this.socket?.to(roomId).emit(event, data);
  }

  sendToUser(socketId: string, event: string, data: any): void {
    this.socket?.to(socketId).emit(event, data);
  }

  getConnectedUsers(): any[] {
    return Array.from(this.connectedUsers.values());
  }
}
```

#### JWT Authentication Classes

DolphJS provides built-in authentication classes for JWT token handling.

```typescript
class JwtBasicAuth {
  tokenSecret: string;
  
  constructor(tokenSecret: string) {
    this.tokenSecret = tokenSecret;
  }

  Verify = TryCatchAsyncFn(async (req: DRequest, res: DResponse, next: DNextFunc) => {
    try {
      const token = this.extractToken(req);
      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      const payload = verifyJWTwithHMAC({
        token,
        secret: this.tokenSecret
      });

      req.payload = payload;
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  });

  private extractToken(req: DRequest): string | null {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return null;
  }
}
```

##### JWT Authorization Class

```typescript
class JwtAuthorizationClass extends JwtBasicAuth {
  private authorizationFn: (payload: any) => boolean;

  constructor(tokenSecret: string, authorizationFn: (payload: any) => boolean) {
    super(tokenSecret);
    this.authorizationFn = authorizationFn;
  }

  Authorize = TryCatchAsyncFn(async (req: DRequest, res: DResponse, next: DNextFunc) => {
    // First verify the token
    await this.Verify(req, res, () => {});

    // Then check authorization
    if (!this.authorizationFn(req.payload)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    next();
  });
}

// Usage example
const adminOnly = (payload: any) => payload.role === 'admin';
const adminAuth = new JwtAuthorizationClass('secret', adminOnly);
```

#### Class-Based Dependency Injection

```typescript
// Service injection into controllers
@Component({
  controllers: [UserController, AdminController],
  services: [UserService, EmailService, LoggingService]
})
export class UserComponent {}

// The framework automatically injects services into controllers
export class UserController extends DolphControllerHandler<Dolph> {
  // These properties are automatically injected
  private userService: UserService;
  private emailService: EmailService;
  private loggingService: LoggingService;

  @Post('register')
  async register(@DReq() req: DRequest, @DRes() res: DResponse) {
    const user = await this.userService.create(req.body);
    await this.emailService.sendWelcomeEmail(user.email);
    this.loggingService.log('User registered', { userId: user.id });
    
    SuccessResponse({ res, body: { user }, status: 201 });
  }
}
```

#### Advanced Class Patterns

##### Generic Service Classes

```typescript
abstract class BaseService<T, CreateDto, UpdateDto> extends DolphServiceHandler<Dolph> {
  protected items: T[] = [];

  constructor(serviceName: string) {
    super(serviceName);
  }

  async findAll(): Promise<T[]> {
    return this.items;
  }

  async findById(id: string): Promise<T | null> {
    return this.items.find((item: any) => item.id === id) || null;
  }

  abstract create(data: CreateDto): Promise<T>;
  abstract update(id: string, data: UpdateDto): Promise<T | null>;
  abstract delete(id: string): Promise<boolean>;
}

// Specific implementation
export class ProductService extends BaseService<Product, CreateProductDto, UpdateProductDto> {
  constructor() {
    super('productService');
  }

  async create(data: CreateProductDto): Promise<Product> {
    const product: Product = {
      id: generateId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.items.push(product);
    return product;
  }

  async update(id: string, data: UpdateProductDto): Promise<Product | null> {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return null;

    this.items[index] = {
      ...this.items[index],
      ...data,
      updatedAt: new Date()
    };
    return this.items[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }
}
```

##### Mixin Classes

```typescript
// Timestampable mixin
function Timestampable<T extends Constructor>(Base: T) {
  return class extends Base {
    createdAt: Date = new Date();
    updatedAt: Date = new Date();

    updateTimestamp() {
      this.updatedAt = new Date();
    }
  };
}

// Auditable mixin
function Auditable<T extends Constructor>(Base: T) {
  return class extends Base {
    createdBy?: string;
    updatedBy?: string;

    setAuditInfo(userId: string, isUpdate = false) {
      if (isUpdate) {
        this.updatedBy = userId;
      } else {
        this.createdBy = userId;
      }
    }
  };
}

// Combined service class
export class AuditableUserService extends Auditable(Timestampable(DolphServiceHandler)) {
  constructor() {
    super('auditableUserService');
  }

  async createUser(userData: CreateUserDto, createdBy: string) {
    const user = new User(userData);
    this.setAuditInfo(createdBy);
    this.updateTimestamp();
    return user;
  }
}
```

#### Class Lifecycle and Hooks

```typescript
// Lifecycle hooks for services
export abstract class LifecycleService extends DolphServiceHandler<Dolph> {
  
  async onInit?(): Promise<void>;
  async onDestroy?(): Promise<void>;

  constructor(name: string) {
    super(name);
    this.initialize();
  }

  private async initialize() {
    if (this.onInit) {
      await this.onInit();
    }
  }
}

// Implementation with lifecycle hooks
export class DatabaseService extends LifecycleService {
  private connection: any;

  constructor() {
    super('databaseService');
  }

  async onInit(): Promise<void> {
    this.connection = await this.connect();
    console.log('Database service initialized');
  }

  async onDestroy(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
      console.log('Database service destroyed');
    }
  }

  private async connect() {
    // Database connection logic
    return { close: () => Promise.resolve() };
  }
}
```

These classes provide the foundation for building robust, scalable DolphJS applications with proper separation of concerns, dependency injection, and lifecycle management. 