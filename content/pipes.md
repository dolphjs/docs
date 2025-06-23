### Pipes

Pipes are a powerful feature in DolphJS that allow you to transform data as it flows through your application. They are commonly used for data validation, transformation, serialization, and formatting.

#### What are Pipes?

A pipe is a class annotated with the `@Injectable()` decorator that implements the `PipeTransform` interface. Pipes have two main use cases:

1. **Transformation**: Transform input data to the desired form (e.g., from string to integer)
2. **Validation**: Evaluate input data and throw an exception if invalid

#### Built-in Pipes

DolphJS provides several built-in pipes out of the box:

- **ValidationPipe**: Validates incoming data against defined schemas
- **ParseIntPipe**: Transforms strings to integers
- **ParseBoolPipe**: Transforms strings to booleans
- **ParseArrayPipe**: Transforms strings to arrays
- **ParseUUIDPipe**: Validates and transforms UUID strings

##### Using Built-in Pipes

```typescript
import { ParseIntPipe, ParseBoolPipe, ValidationPipe } from '@dolphjs/dolph';

@Route('users')
export class UserController extends DolphControllerHandler<Dolph> {
  
  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
    @Query('active', ParseBoolPipe) isActive: boolean
  ) {
    return this.userService.findById(id, isActive);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
```

#### Custom Pipes

You can create custom pipes by implementing the `PipeTransform` interface:

```typescript
import { Injectable, PipeTransform, BadRequestException } from '@dolphjs/dolph';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed: numeric string expected');
    }
    return val;
  }
}

// Custom email validation pipe
@Injectable()
export class EmailValidationPipe implements PipeTransform {
  transform(value: string): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new BadRequestException('Invalid email format');
    }
    return value.toLowerCase();
  }
}

// Usage
@Post('subscribe')
async subscribe(@Body('email', EmailValidationPipe) email: string) {
  return this.newsletterService.subscribe(email);
}
```

#### Validation Pipes with Schemas

Create validation pipes using popular validation libraries:

```typescript
import Joi from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: Joi.ObjectSchema) {}

  transform(value: any): any {
    const { error, value: validatedValue } = this.schema.validate(value);
    if (error) {
      throw new BadRequestException('Validation failed');
    }
    return validatedValue;
  }
}

// Usage with Joi schema
const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(18).max(120)
});

@Post()
@UsePipes(new JoiValidationPipe(createUserSchema))
async createUser(@Body() userData: any) {
  return this.userService.create(userData);
}
```

#### Transform Pipes

Pipes can also transform data into different formats:

```typescript
@Injectable()
export class UpperCasePipe implements PipeTransform<string, string> {
  transform(value: string): string {
    return value.toUpperCase();
  }
}

@Injectable()
export class TrimPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    return typeof value === 'string' ? value.trim() : value;
  }
}

// Date transformation pipe
@Injectable()
export class DateTransformPipe implements PipeTransform {
  transform(value: string): Date {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date format');
    }
    return date;
  }
}

// Usage
@Get('search')
async search(
  @Query('query', TrimPipe, UpperCasePipe) searchTerm: string,
  @Query('date', DateTransformPipe) filterDate: Date
) {
  return this.searchService.search(searchTerm, filterDate);
}
```

#### Global Pipes

You can apply pipes globally to all routes:

```typescript
// In main.ts or server.ts
import { ValidationPipe } from '@dolphjs/dolph';

const dolph = new DolphFactory([AppComponent]);

// Apply global validation pipe
dolph.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true
}));

dolph.start();
```

#### Pipe Composition

Multiple pipes can be chained together:

```typescript
@Injectable()
export class DefaultValuePipe implements PipeTransform {
  constructor(private defaultValue: any) {}

  transform(value: any): any {
    return value !== undefined ? value : this.defaultValue;
  }
}

// Chain multiple pipes
@Get('list')
async getUsers(
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
) {
  return this.userService.findMany(page, limit);
}
```

#### Async Pipes

Pipes can also be asynchronous:

```typescript
@Injectable()
export class AsyncValidationPipe implements PipeTransform {
  constructor(private userService: UserService) {}

  async transform(value: string): Promise<string> {
    const userExists = await this.userService.existsByEmail(value);
    if (userExists) {
      throw new BadRequestException('Email already exists');
    }
    return value;
  }
}

// Usage
@Post('register')
async register(
  @Body('email', AsyncValidationPipe) email: string,
  @Body() userData: RegisterDto
) {
  return this.authService.register({ ...userData, email });
}
```

#### Exception Handling in Pipes

Pipes should throw appropriate exceptions when validation fails:

```typescript
@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  constructor(private maxSize: number) {}

  transform(file: Express.Multer.File): Express.Multer.File {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    
    if (file.size > this.maxSize) {
      throw new BadRequestException(
        `File size ${file.size} exceeds maximum size ${this.maxSize}`
      );
    }
    
    return file;
  }
}

// Usage with file upload
@Post('upload')
@MediaParser({ fieldname: 'file', type: 'single' })
async uploadFile(
  @UploadedFile(new FileSizeValidationPipe(1024 * 1024)) file: Express.Multer.File
) {
  return this.fileService.processUpload(file);
}
```

#### Best Practices

1. **Keep pipes focused**: Each pipe should have a single responsibility
2. **Use built-in pipes when possible**: Leverage existing functionality
3. **Handle errors gracefully**: Provide meaningful error messages
4. **Consider performance**: Avoid heavy operations in pipes
5. **Make pipes reusable**: Design pipes to be used across different controllers

Pipes provide a clean and reusable way to validate and transform data in your DolphJS applications, helping maintain consistency and data integrity throughout your application.