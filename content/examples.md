### Examples

This section provides comprehensive examples of building real-world applications with DolphJS, showcasing best practices, patterns, and advanced features.

#### Complete REST API Example

Let's build a complete blog API with authentication, CRUD operations, and advanced features.

##### Project Structure

```
blog-api/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── auth.component.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── dto/
│   │   │       ├── login.dto.ts
│   │   │       └── register.dto.ts
│   │   ├── posts/
│   │   │   ├── posts.component.ts
│   │   │   ├── posts.controller.ts
│   │   │   ├── posts.service.ts
│   │   │   └── dto/
│   │   │       ├── create-post.dto.ts
│   │   │       └── update-post.dto.ts
│   │   └── users/
│   │       ├── users.component.ts
│   │       ├── users.controller.ts
│   │       └── users.service.ts
│   ├── models/
│   │   ├── user.model.ts
│   │   └── post.model.ts
│   ├── shared/
│   │   ├── guards/
│   │   ├── interfaces/
│   │   └── utils/
│   └── server.ts
├── tests/
├── dolph_config.yaml
└── package.json
```

##### Models

```typescript
// src/models/user.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);
```

```typescript
// src/models/post.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true
});

export const PostModel = mongoose.model<IPost>('Post', PostSchema);
```

##### DTOs and Validation

```typescript
// src/components/auth/dto/register.dto.ts
import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  role?: 'admin' | 'user';
}
```

```typescript
// src/components/posts/dto/create-post.dto.ts
import { IsString, IsArray, IsOptional, MaxLength, IsIn } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsIn(['draft', 'published'])
  status?: 'draft' | 'published';
}
```

##### Services

```typescript
// src/components/auth/auth.service.ts
import { DolphServiceHandler } from '@dolphjs/dolph';
import { hashString, compareHashedString, generateJWTwithHMAC } from '@dolphjs/dolph';
import { UserModel, IUser } from '../../models/user.model';
import { RegisterDto, LoginDto } from './dto';
import { ConflictException, UnauthorizedException } from '@dolphjs/dolph';

@InjectMongo('User', UserModel)
export class AuthService extends DolphServiceHandler<Dolph> {
  User!: typeof UserModel;

  constructor() {
    super('authService');
  }

  async register(registerDto: RegisterDto): Promise<{ user: Partial<IUser>; token: string }> {
    const { username, email, password, role } = registerDto;

    // Check if user exists
    const existingUser = await this.User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      throw new ConflictException('User with this email or username already exists');
    }

    // Hash password
    const hashedPassword = await hashString(password, 12);

    // Create user
    const user = await this.User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    // Generate token
    const token = this.generateToken(user);

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  async login(loginDto: LoginDto): Promise<{ user: Partial<IUser>; token: string }> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.User.findOne({ email, isActive: true });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await compareHashedString(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user);

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  private generateToken(user: IUser): string {
    return generateJWTwithHMAC({
      payload: {
        sub: user._id.toString(),
        username: user.username,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      },
      secret: process.env.JWT_SECRET || 'default-secret'
    });
  }
}
```

```typescript
// src/components/posts/posts.service.ts
import { DolphServiceHandler } from '@dolphjs/dolph';
import { PostModel, IPost } from '../../models/post.model';
import { CreatePostDto, UpdatePostDto } from './dto';
import { NotFoundException, ForbiddenException } from '@dolphjs/dolph';

@InjectMongo('Post', PostModel)
export class PostsService extends DolphServiceHandler<Dolph> {
  Post!: typeof PostModel;

  constructor() {
    super('postsService');
  }

  async findAll(query: any = {}): Promise<IPost[]> {
    const { status, author, tags, limit = 10, page = 1 } = query;
    
    const filter: any = {};
    if (status) filter.status = status;
    if (author) filter.author = author;
    if (tags) filter.tags = { $in: tags.split(',') };

    const skip = (page - 1) * limit;

    return this.Post.find(filter)
      .populate('author', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
  }

  async findById(id: string): Promise<IPost> {
    const post = await this.Post.findById(id)
      .populate('author', 'username email');

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async create(createPostDto: CreatePostDto, authorId: string): Promise<IPost> {
    const postData = {
      ...createPostDto,
      author: authorId,
      publishedAt: createPostDto.status === 'published' ? new Date() : undefined
    };

    const post = await this.Post.create(postData);
    return this.Post.findById(post._id).populate('author', 'username email');
  }

  async update(id: string, updatePostDto: UpdatePostDto, userId: string, userRole: string): Promise<IPost> {
    const post = await this.Post.findById(id);
    
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check permissions
    if (post.author.toString() !== userId && userRole !== 'admin') {
      throw new ForbiddenException('You can only update your own posts');
    }

    // Handle status change to published
    if (updatePostDto.status === 'published' && post.status !== 'published') {
      updatePostDto.publishedAt = new Date();
    }

    const updatedPost = await this.Post.findByIdAndUpdate(
      id,
      updatePostDto,
      { new: true }
    ).populate('author', 'username email');

    return updatedPost;
  }

  async delete(id: string, userId: string, userRole: string): Promise<void> {
    const post = await this.Post.findById(id);
    
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check permissions
    if (post.author.toString() !== userId && userRole !== 'admin') {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.Post.findByIdAndDelete(id);
  }
}
```

##### Controllers

```typescript
// src/components/auth/auth.controller.ts
import { DolphControllerHandler } from '@dolphjs/dolph';
import { Route, Post, DReq, DRes, TryCatchAsyncDec, ValidateReq } from '@dolphjs/dolph';
import { SuccessResponse, DRequest, DResponse } from '@dolphjs/dolph';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import Joi from 'joi';

@Route('auth')
export class AuthController extends DolphControllerHandler<Dolph> {
  private authService: AuthService;

  @Post('register')
  @ValidateReq({
    body: Joi.object({
      username: Joi.string().alphanum().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      role: Joi.string().valid('admin', 'user').optional()
    })
  })
  @TryCatchAsyncDec()
  async register(@DReq() req: DRequest, @DRes() res: DResponse) {
    const result = await this.authService.register(req.body);
    
    SuccessResponse({
      res,
      body: result,
      msg: 'User registered successfully',
      status: 201
    });
  }

  @Post('login')
  @ValidateReq({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    })
  })
  @TryCatchAsyncDec()
  async login(@DReq() req: DRequest, @DRes() res: DResponse) {
    const result = await this.authService.login(req.body);
    
    SuccessResponse({
      res,
      body: result,
      msg: 'Login successful'
    });
  }
}
```

```typescript
// src/components/posts/posts.controller.ts
import { DolphControllerHandler } from '@dolphjs/dolph';
import { 
  Route, Get, Post, Put, Delete, 
  DReq, DRes, TryCatchAsyncDec, ValidateReq,
  JWTAuthVerifyDec, UseMiddleware 
} from '@dolphjs/dolph';
import { SuccessResponse, DRequest, DResponse } from '@dolphjs/dolph';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto';
import Joi from 'joi';

@Route('posts')
export class PostsController extends DolphControllerHandler<Dolph> {
  private postsService: PostsService;

  @Get()
  @TryCatchAsyncDec()
  async findAll(@DReq() req: DRequest, @DRes() res: DResponse) {
    const posts = await this.postsService.findAll(req.query);
    
    SuccessResponse({
      res,
      body: { posts, total: posts.length },
      msg: 'Posts retrieved successfully'
    });
  }

  @Get(':id')
  @TryCatchAsyncDec()
  async findById(@DReq() req: DRequest, @DRes() res: DResponse) {
    const post = await this.postsService.findById(req.params.id);
    
    SuccessResponse({
      res,
      body: { post },
      msg: 'Post retrieved successfully'
    });
  }

  @Post()
  @JWTAuthVerifyDec(process.env.JWT_SECRET || 'default-secret')
  @ValidateReq({
    body: Joi.object({
      title: Joi.string().max(200).required(),
      content: Joi.string().required(),
      tags: Joi.array().items(Joi.string()).optional(),
      status: Joi.string().valid('draft', 'published').optional()
    })
  })
  @TryCatchAsyncDec()
  async create(@DReq() req: DRequest, @DRes() res: DResponse) {
    const post = await this.postsService.create(req.body, req.payload.sub);
    
    SuccessResponse({
      res,
      body: { post },
      msg: 'Post created successfully',
      status: 201
    });
  }

  @Put(':id')
  @JWTAuthVerifyDec(process.env.JWT_SECRET || 'default-secret')
  @ValidateReq({
    body: Joi.object({
      title: Joi.string().max(200).optional(),
      content: Joi.string().optional(),
      tags: Joi.array().items(Joi.string()).optional(),
      status: Joi.string().valid('draft', 'published', 'archived').optional()
    })
  })
  @TryCatchAsyncDec()
  async update(@DReq() req: DRequest, @DRes() res: DResponse) {
    const post = await this.postsService.update(
      req.params.id,
      req.body,
      req.payload.sub,
      req.payload.role
    );
    
    SuccessResponse({
      res,
      body: { post },
      msg: 'Post updated successfully'
    });
  }

  @Delete(':id')
  @JWTAuthVerifyDec(process.env.JWT_SECRET || 'default-secret')
  @TryCatchAsyncDec()
  async delete(@DReq() req: DRequest, @DRes() res: DResponse) {
    await this.postsService.delete(
      req.params.id,
      req.payload.sub,
      req.payload.role
    );
    
    SuccessResponse({
      res,
      msg: 'Post deleted successfully',
      status: 204
    });
  }
}
```

##### Components

```typescript
// src/components/auth/auth.component.ts
import { Component } from '@dolphjs/dolph';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Component({
  controllers: [AuthController],
  services: [AuthService]
})
export class AuthComponent {}
```

```typescript
// src/components/posts/posts.component.ts
import { Component } from '@dolphjs/dolph';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Component({
  controllers: [PostsController],
  services: [PostsService]
})
export class PostsComponent {}
```

##### Server Setup

```typescript
// src/server.ts
import { DolphFactory, middlewareRegistry } from '@dolphjs/dolph';
import { autoInitMongo } from '@dolphjs/dolph';
import { AuthComponent } from './components/auth/auth.component';
import { PostsComponent } from './components/posts/posts.component';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Global middleware
middlewareRegistry.register(helmet());
middlewareRegistry.register(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

// Database connection
autoInitMongo({
  url: process.env.MONGO_URL || 'mongodb://localhost:27017/blog_api'
});

// Create application
const dolph = new DolphFactory([AuthComponent, PostsComponent], {
  options: {
    cors: { origin: '*' },
    jsonLimit: '10mb'
  }
});

dolph.start();
```

##### Configuration

```yaml
# dolph_config.yaml
port: 3000
env: "development"
jsonLimit: "10mb"
globalExceptionFilter: true

database:
  mongo:
    url: "mongodb://localhost:27017/blog_api"
    options:
      useNewUrlParser: true
      useUnifiedTopology: true

middlewares:
  cors:
    enable: true
    origin: "*"
    methods:
      - GET
      - POST
      - PUT
      - DELETE
    allowedHeaders:
      - Content-Type
      - Authorization
```

##### Environment Variables

```bash
# .env
NODE_ENV=development
PORT=3000
MONGO_URL=mongodb://localhost:27017/blog_api
JWT_SECRET=your-super-secret-jwt-key-here
```

#### Real-time Chat Application

```typescript
// Real-time chat with Socket.io
import { DolphSocketServiceHandler } from '@dolphjs/dolph';

export class ChatSocketService extends DolphSocketServiceHandler<Dolph> {
  private activeUsers = new Map();

  constructor() {
    super();
    this.initializeEventHandlers();
  }

  private initializeEventHandlers() {
    this.socket?.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      // User joins
      socket.on('join', (userData) => {
        this.activeUsers.set(socket.id, userData);
        socket.broadcast.emit('user_joined', userData);
        socket.emit('active_users', Array.from(this.activeUsers.values()));
      });

      // Handle messages
      socket.on('send_message', (messageData) => {
        const user = this.activeUsers.get(socket.id);
        const message = {
          id: generateMessageId(),
          text: messageData.text,
          user: user,
          timestamp: new Date(),
          type: 'text'
        };

        if (messageData.roomId) {
          socket.to(messageData.roomId).emit('receive_message', message);
        } else {
          socket.broadcast.emit('receive_message', message);
        }
      });

      // Handle typing indicators
      socket.on('typing_start', (data) => {
        socket.broadcast.emit('user_typing', {
          userId: socket.id,
          username: this.activeUsers.get(socket.id)?.username
        });
      });

      socket.on('typing_stop', () => {
        socket.broadcast.emit('user_stopped_typing', {
          userId: socket.id
        });
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        const user = this.activeUsers.get(socket.id);
        this.activeUsers.delete(socket.id);
        socket.broadcast.emit('user_left', user);
        console.log('User disconnected:', socket.id);
      });
    });
  }
}

function generateMessageId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
```

These examples demonstrate real-world usage patterns, best practices, and how different DolphJS features work together to create robust applications. 