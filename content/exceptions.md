### Exception Handling

DolphJS provides a comprehensive exception handling system with specific exception types for different HTTP status codes and error scenarios. This allows for consistent error responses and better debugging capabilities.

#### Exception System Overview

All exceptions in DolphJS extend from the base `DefaultException` class, which provides a consistent interface for error handling. The framework automatically catches these exceptions and converts them to appropriate HTTP responses.

```typescript
// Base exception class structure
abstract class DefaultException extends Error {
  abstract readonly statusCode: number;
  abstract readonly message: string;
  readonly isOperational: boolean = true;
  
  constructor(message: string, statusCode: number, isOperational: boolean, stack?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
```

#### Built-in Exception Classes

DolphJS provides specific exception classes for all common HTTP status codes:

##### 4xx Client Error Exceptions

```typescript
import {
  BadRequestException,      // 400
  UnauthorizedException,    // 401
  PaymentRequiredException, // 402
  ForbiddenException,      // 403
  NotFoundException,       // 404
  MethodNotAllowedException, // 405
  NotAcceptableException,  // 406
  ConflictException,       // 409
  GoneException,          // 410
  ImATeapotException,     // 418
  MisdirectedException,   // 421
  UnsupportedMediaTypeException, // 415
} from '@dolphjs/dolph';

// Usage examples
@Route('users')
export class UserController extends DolphControllerHandler<Dolph> {
  
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Post()
  async createUser(@Body() userData: CreateUserDto) {
    const existingUser = await this.userService.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    
    if (!userData.email || !userData.password) {
      throw new BadRequestException('Email and password are required');
    }
    
    return this.userService.create(userData);
  }

  @Put(':id')
  @JWTAuthVerifyDec('secret')
  async updateUser(@Param('id') id: string, @DReq() req: DRequest) {
    if (req.payload.sub !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    
    return this.userService.update(id, req.body);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const deleted = await this.userService.delete(id);
    if (!deleted) {
      throw new GoneException('User has already been deleted');
    }
    
    SuccessResponse({ res, msg: 'User deleted successfully' });
  }
}
```

##### 5xx Server Error Exceptions

```typescript
import {
  InternalServerErrorException, // 500
  NotImplementedException,     // 501
  BadGatewayException,        // 502
  ServiceUnavailableException, // 503
  TimeoutException,           // 504
  HttpVersionNotSupportedException, // 505
} from '@dolphjs/dolph';

// Usage examples
@Service()
export class ExternalApiService extends DolphServiceHandler<Dolph> {
  
  async callExternalAPI(endpoint: string) {
    try {
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        if (response.status === 502) {
          throw new BadGatewayException('External service returned bad gateway');
        }
        if (response.status === 503) {
          throw new ServiceUnavailableException('External service is temporarily unavailable');
        }
      }
      
      return response.json();
    } catch (error) {
      if (error.code === 'TIMEOUT') {
        throw new TimeoutException('Request to external service timed out');
      }
      
      throw new InternalServerErrorException('Failed to call external API');
    }
  }

  async processData(data: any[]) {
    throw new NotImplementedException('Data processing feature coming soon');
  }
}
```

#### Custom Exception Classes

You can create custom exception classes for specific business logic errors:

```typescript
// Custom business logic exceptions
export class UserNotVerifiedException extends UnauthorizedException {
  constructor(email: string) {
    super(`User ${email} has not verified their email address`);
  }
}

export class InsufficientBalanceException extends BadRequestException {
  constructor(balance: number, required: number) {
    super(`Insufficient balance. Current: ${balance}, Required: ${required}`);
  }
}

export class ResourceLockedException extends ConflictException {
  constructor(resourceType: string, resourceId: string) {
    super(`${resourceType} with ID ${resourceId} is currently locked by another process`);
  }
}

// Usage in services
export class PaymentService extends DolphServiceHandler<Dolph> {
  
  async processPayment(userId: string, amount: number) {
    const user = await this.userService.findById(userId);
    
    if (!user.isVerified) {
      throw new UserNotVerifiedException(user.email);
    }
    
    if (user.balance < amount) {
      throw new InsufficientBalanceException(user.balance, amount);
    }
    
    // Process payment...
  }
}
```

#### Exception Filters

Create custom exception filters to handle specific types of errors:

```typescript
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ExecutionContext) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<DResponse>();
    const request = ctx.getRequest<DRequest>();
    
    let status = 500;
    let message = 'Internal server error';
    
    if (exception instanceof DefaultException) {
      status = exception.statusCode;
      message = exception.message;
    }
    
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message,
      ...(process.env.NODE_ENV === 'development' && { stack: exception.stack })
    };
    
    response.status(status).json(errorResponse);
  }
}

// Apply filter globally
const dolph = new DolphFactory([AppComponent]);
dolph.useGlobalFilters(new HttpExceptionFilter());
```

#### Validation Exceptions

Handle validation errors with detailed feedback:

```typescript
export class ValidationException extends BadRequestException {
  constructor(public readonly errors: ValidationError[]) {
    const errorMessages = errors.map(error => 
      Object.values(error.constraints || {}).join(', ')
    ).join('; ');
    
    super(`Validation failed: ${errorMessages}`);
  }
}

// Custom validation pipe that throws ValidationException
@Injectable()
export class CustomValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      const errors = await validate(value);
      if (errors.length > 0) {
        throw new ValidationException(errors);
      }
    }
    return value;
  }
}
```

#### Error Response Format

DolphJS provides consistent error response formatting:

```typescript
// Standard error response structure
interface ErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
  timestamp: string;
  path: string;
  details?: any; // Additional error details
}

// Example error responses
{
  "statusCode": 404,
  "message": "User with ID 123 not found",
  "error": "Not Found",
  "timestamp": "2023-12-07T10:30:00.000Z",
  "path": "/api/users/123"
}

{
  "statusCode": 400,
  "message": "Validation failed: email must be a valid email",
  "error": "Bad Request",
  "timestamp": "2023-12-07T10:30:00.000Z",
  "path": "/api/users",
  "details": {
    "field": "email",
    "value": "invalid-email",
    "constraints": ["isEmail"]
  }
}
```

#### Global Exception Handler

Set up a global exception handler to catch all unhandled errors:

```typescript
export const globalExceptionHandler = (
  error: any, 
  req: DRequest, 
  res: DResponse, 
  next: DNextFunc
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  
  // Log the error
  logger.error('Unhandled exception:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query
  });
  
  if (error instanceof DefaultException) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }
  
  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Something went wrong';
  }
  
  res.status(statusCode).json({
    statusCode,
    message,
    timestamp: new Date().toISOString(),
    path: req.path,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
};

// Register the global handler
const dolph = new DolphFactory([AppComponent]);
dolph.useGlobalMiddleware(globalExceptionHandler);
```

#### Async Error Handling

Handle errors in async operations properly:

```typescript
@Route('async')
export class AsyncController extends DolphControllerHandler<Dolph> {
  
  @Get('data')
  @TryCatchAsyncDec() // Automatic async error handling
  async getData() {
    // This will automatically catch and handle promise rejections
    const data = await this.dataService.fetchExternalData();
    return data;
  }

  @Post('process')
  async processData(@Body() data: any) {
    try {
      const result = await this.dataService.processAsync(data);
      return result;
    } catch (error) {
      if (error.code === 'INVALID_FORMAT') {
        throw new BadRequestException('Data format is invalid');
      }
      if (error.code === 'PROCESSING_FAILED') {
        throw new InternalServerErrorException('Data processing failed');
      }
      throw error; // Re-throw unknown errors
    }
  }
}
```

#### Best Practices

1. **Use Specific Exceptions**: Choose the most appropriate exception type for each error case
2. **Provide Clear Messages**: Include helpful details in exception messages
3. **Don't Expose Sensitive Information**: Be careful not to leak internal details in error messages
4. **Log Errors Appropriately**: Use different log levels for different types of errors
5. **Handle Async Errors**: Always handle promise rejections properly
6. **Use Exception Filters**: Create custom filters for consistent error handling
7. **Test Error Scenarios**: Write tests for error handling paths

#### Error Monitoring and Logging

Set up proper error monitoring:

```typescript
// Error tracking service
@Injectable()
export class ErrorTrackingService {
  
  trackError(error: any, context: any = {}) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      statusCode: error.statusCode || 500,
      timestamp: new Date().toISOString(),
      context
    };
    
    // Send to external monitoring service (e.g., Sentry)
    if (process.env.SENTRY_DSN) {
      this.sentryService.captureException(error, errorInfo);
    }
    
    // Log locally
    logger.error('Application error:', errorInfo);
  }
}

// Use in exception filter
@Injectable()
export class MonitoringExceptionFilter implements ExceptionFilter {
  constructor(private errorTracking: ErrorTrackingService) {}
  
  catch(exception: any, host: ExecutionContext) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<DRequest>();
    
    this.errorTracking.trackError(exception, {
      url: request.url,
      method: request.method,
      userAgent: request.headers['user-agent'],
      ip: request.ip
    });
    
    // ... handle response
  }
}
```

This comprehensive exception handling system ensures that your DolphJS application provides consistent, informative error responses while maintaining security and debuggability. 