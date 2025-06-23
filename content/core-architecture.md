### Core Architecture

The DolphJS framework is built around several core architectural components that work together to provide a robust, scalable application structure.

#### DolphFactory

The `DolphFactory` is the main entry point for creating and configuring DolphJS applications. It serves as the central orchestrator that initializes all components, services, middleware, and routing.

```typescript
class DolphFactoryClass<T extends DolphControllerHandler<Dolph>> {
    private routes = [];
    private controllers = [];
    private sockets?: DSocketInit<Dolph>;
    private socketService?: SocketService;
    private routingBase: string = '';
    private isGraphQL: boolean = false;

    port: dolphPort = process.env.PORT || 3030;
    env = process.env.NODE_ENV || 'development';
    configs: DolphConfig;
    externalMiddlewares: RequestHandler[];
    jsonLimit = '5mb';
    globalFilter = false;
}
```

##### Basic Factory Setup

```typescript
import { DolphFactory } from '@dolphjs/dolph';
import { AppComponent } from './app.component';

const dolph = new DolphFactory([AppComponent]);
dolph.start();
```

##### Advanced Factory Configuration

```typescript
import { DolphFactory, SocketService, middlewareRegistry } from '@dolphjs/dolph';
import { AppComponent, ChatComponent } from './components';
import helmet from 'helmet';

// Register global middleware
middlewareRegistry.register(helmet());

// Configure with options
const dolph = new DolphFactory([AppComponent], {
  options: { 
    cors: { origin: '*' },
    jsonLimit: '10mb'
  },
  socketService: SocketService,
  component: new ChatComponent(),
});

// Configure additional settings
dolph.setGlobalPrefix('/api/v1');
dolph.enableCors({
  origin: ['https://myapp.com'],
  credentials: true
});

dolph.start();
```

#### Application Lifecycle

The DolphJS application follows a specific lifecycle during startup:

1. **Configuration Loading**: Load `dolph_config.yaml` and environment variables
2. **Middleware Registration**: Register global middleware from `middlewareRegistry`
3. **Component Discovery**: Scan and register all components
4. **Service Injection**: Initialize dependency injection container
5. **Route Registration**: Map all controller routes
6. **Database Connections**: Initialize configured database connections
7. **Socket Initialization**: Set up WebSocket connections if configured
8. **Server Startup**: Start the Express server

```typescript
// Lifecycle hooks (if needed for custom initialization)
import { DolphFactory, OnApplicationBootstrap, OnApplicationShutdown } from '@dolphjs/dolph';

export class AppModule implements OnApplicationBootstrap, OnApplicationShutdown {
  onApplicationBootstrap() {
    console.log('Application is starting...');
  }

  onApplicationShutdown() {
    console.log('Application is shutting down...');
  }
}
```

#### Component System Architecture

Components are the fundamental building blocks that organize your application's functionality:

```typescript
@Component({
  controllers: [UserController, AdminController],
  services: [UserService, EmailService],
  providers: [DatabaseProvider],
  imports: [SharedModule]
})
export class UserComponent {}
```

##### Component Registration Flow

1. **Declaration**: Components are declared with the `@Component` decorator
2. **Registration**: Components are passed to `DolphFactory` constructor
3. **Service Resolution**: Services are injected into controllers
4. **Route Mapping**: Controller routes are registered with Express router
5. **Middleware Application**: Component-level middleware is applied

#### Dependency Injection Architecture

DolphJS implements a powerful dependency injection system:

```typescript
// Service Definition
@Injectable()
export class UserService extends DolphServiceHandler<Dolph> {
  constructor() {
    super('userService');
  }
  
  findAll() {
    return this.users;
  }
}

// Service Injection
@Component({
  controllers: [UserController],
  services: [UserService]
})
export class UserComponent {}

// Controller Usage
@Route('users')
export class UserController extends DolphControllerHandler<Dolph> {
  private userService: UserService; // Automatically injected
  
  @Get()
  async getUsers(req: DRequest, res: DResponse) {
    const users = this.userService.findAll();
    SuccessResponse({ res, body: { users } });
  }
}
```

#### Request Processing Pipeline

Every HTTP request follows this processing pipeline:

1. **Global Middleware**: CORS, security headers, body parsing
2. **Route Matching**: Express router finds matching route
3. **Shield Middleware**: Component-level authentication/authorization
4. **Method Middleware**: Controller method-specific middleware
5. **Validation**: Request validation using decorators
6. **Controller Execution**: Business logic execution
7. **Response Processing**: Response transformation and sending
8. **Error Handling**: Global error handling if exceptions occur

```typescript
// Example pipeline for POST /api/users
Request → CORS → Helmet → Body Parser → Auth Shield → Validation → Controller → Response
```

#### Error Handling Architecture

DolphJS provides a comprehensive error handling system:

```typescript
// Custom Exception Classes
export class UserNotFoundException extends NotFoundException {
  constructor(userId: string) {
    super(`User with ID ${userId} not found`);
  }
}

// Global Error Handler
export const globalErrorHandler = (err: any, req: DRequest, res: DResponse, next: DNextFunc) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    error: {
      message,
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.path
    }
  });
};

// Exception Filters
@Component({
  controllers: [UserController],
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: AllExceptionsFilter
    }
  ]
})
export class AppComponent {}
```

#### Configuration Architecture

DolphJS supports multiple configuration sources with a clear precedence order:

1. **Environment Variables** (highest priority)
2. **dolph_config.yaml** file
3. **Default values** (lowest priority)

```typescript
// Configuration Schema
interface DolphConfig {
  port?: number;
  env?: 'development' | 'production' | 'test';
  database?: {
    mongo?: MongoConfig;
    mysql?: MySQLConfig;
  };
  middlewares?: {
    cors?: CorsConfig;
    security?: SecurityConfig;
  };
  routing?: {
    globalPrefix?: string;
    versioningType?: 'URI' | 'HEADER';
  };
}

// Configuration Loading
const config = loadConfiguration();
const dolph = new DolphFactory([AppComponent], {
  options: config
});
```

#### Module System Architecture

DolphJS supports a modular architecture for large applications:

```typescript
// Feature Module
@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [UserController],
  services: [UserService],
  exports: [UserService]
})
export class UserModule {}

// Shared Module
@Module({
  services: [ConfigService, LoggerService],
  exports: [ConfigService, LoggerService]
})
export class SharedModule {}

// App Module
@Module({
  imports: [UserModule, SharedModule],
  controllers: [AppController]
})
export class AppModule {}
```

#### Database Architecture Integration

DolphJS provides seamless database integration:

```typescript
// MongoDB Integration
@InjectMongo('User', UserModel)
export class UserService extends DolphServiceHandler<Dolph> {
  User!: Model<UserDocument>; // Automatically injected
  
  async findById(id: string) {
    return this.User.findById(id);
  }
}

// MySQL Integration  
@InjectMySQL('User', UserModel)
export class UserService extends DolphServiceHandler<Dolph> {
  User!: ModelStatic<UserInstance>; // Automatically injected
  
  async findAll() {
    return this.User.findAll();
  }
}
```

#### Real-time Architecture (WebSockets)

DolphJS integrates Socket.io for real-time communication:

```typescript
// Socket Service
export class ChatSocketService extends DolphSocketServiceHandler<Dolph> {
  constructor() {
    super();
    this.initializeEventHandlers();
  }

  private initializeEventHandlers() {
    this.socket?.on('connection', (socket) => {
      socket.on('message', (data) => {
        this.socket?.emit('broadcast', data);
      });
    });
  }
}

// Socket Component
@Socket({
  services: [ChatService],
  socketServices: [ChatSocketService]
})
export class ChatComponent extends SocketComponent {}

// Factory Integration
const dolph = new DolphFactory([AppComponent], {
  socketService: SocketService,
  component: new ChatComponent()
});
```

#### Performance Considerations

DolphJS is optimized for performance through:

1. **Lazy Loading**: Components and services are loaded on-demand
2. **Connection Pooling**: Database connections are pooled automatically
3. **Caching**: Built-in caching with MemDB for frequently accessed data
4. **Compression**: Automatic response compression
5. **Static Asset Optimization**: Efficient serving of static files

```typescript
// Performance Configuration
const dolph = new DolphFactory([AppComponent], {
  options: {
    compression: true,
    caching: {
      enabled: true,
      ttl: 300, // 5 minutes
      max: 1000 // Max 1000 cached items
    }
  }
});
```

This architectural foundation provides the robustness, scalability, and maintainability needed for production applications while maintaining developer-friendly APIs and conventions. 