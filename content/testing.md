### Testing

Testing is a crucial part of software development that ensures your DolphJS applications work correctly and remain maintainable. DolphJS supports various testing strategies including unit tests, integration tests, and end-to-end tests.

#### Testing Philosophy

DolphJS follows these testing principles:

1. **Testability by Design**: The framework's architecture supports easy testing
2. **Dependency Injection**: Makes mocking and stubbing straightforward
3. **Separation of Concerns**: Each component can be tested in isolation
4. **Test Pyramid**: Unit tests > Integration tests > E2E tests

#### Testing Setup

##### Installing Testing Dependencies

```bash
# Core testing dependencies
npm install --save-dev jest @types/jest ts-jest

# Testing utilities
npm install --save-dev supertest @types/supertest

# Mocking libraries
npm install --save-dev jest-mock-extended

# Additional utilities
npm install --save-dev mongodb-memory-server @shelf/jest-mongodb
```

##### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/main.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts']
};
```

#### Unit Testing

##### Testing Services

```typescript
// tests/services/user.service.test.ts
import { UserService } from '../../src/services/user.service';
import { UserModel } from '../../src/models/user.model';

// Mock the model
jest.mock('../../src/models/user.model');
const MockedUserModel = UserModel as jest.Mocked<typeof UserModel>;

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      // Arrange
      const userData = {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'hashedPassword'
      };
      
      const expectedUser = { id: 1, ...userData };
      MockedUserModel.create.mockResolvedValue(expectedUser as any);

      // Act
      const result = await userService.create(userData);

      // Assert
      expect(MockedUserModel.create).toHaveBeenCalledWith(userData);
      expect(result).toEqual(expectedUser);
    });

    it('should throw error when email already exists', async () => {
      // Arrange
      const userData = {
        username: 'john_doe',
        email: 'existing@example.com',
        password: 'hashedPassword'
      };

      MockedUserModel.findOne.mockResolvedValue({ id: 1 } as any);

      // Act & Assert
      await expect(userService.create(userData)).rejects.toThrow(
        'User with this email already exists'
      );
    });
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      // Arrange
      const userId = '123';
      const expectedUser = { id: userId, username: 'john_doe' };
      MockedUserModel.findById.mockResolvedValue(expectedUser as any);

      // Act
      const result = await userService.findById(userId);

      // Assert
      expect(MockedUserModel.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedUser);
    });

    it('should return null when user not found', async () => {
      // Arrange
      const userId = 'nonexistent';
      MockedUserModel.findById.mockResolvedValue(null);

      // Act
      const result = await userService.findById(userId);

      // Assert
      expect(result).toBeNull();
    });
  });
});
```

##### Testing Controllers

```typescript
// tests/controllers/user.controller.test.ts
import { UserController } from '../../src/controllers/user.controller';
import { UserService } from '../../src/services/user.service';
import { DRequest, DResponse } from '@dolphjs/dolph';
import { NotFoundException, ConflictException } from '@dolphjs/dolph';

// Mock the service
jest.mock('../../src/services/user.service');
const MockedUserService = UserService as jest.Mocked<typeof UserService>;

describe('UserController', () => {
  let userController: UserController;
  let mockUserService: jest.Mocked<UserService>;
  let mockRequest: Partial<DRequest>;
  let mockResponse: Partial<DResponse>;

  beforeEach(() => {
    mockUserService = new MockedUserService() as jest.Mocked<UserService>;
    userController = new UserController();
    (userController as any).userService = mockUserService;

    mockRequest = {
      params: {},
      body: {},
      query: {}
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      // Arrange
      const userId = '123';
      const expectedUser = { id: userId, username: 'john_doe' };
      mockRequest.params = { id: userId };
      mockUserService.findById.mockResolvedValue(expectedUser);

      // Act
      await userController.getUserById(
        mockRequest as DRequest, 
        mockResponse as DResponse
      );

      // Assert
      expect(mockUserService.findById).toHaveBeenCalledWith(userId);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: 200,
        data: expectedUser
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      // Arrange
      const userId = 'nonexistent';
      mockRequest.params = { id: userId };
      mockUserService.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        userController.getUserById(
          mockRequest as DRequest, 
          mockResponse as DResponse
        )
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      // Arrange
      const userData = {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123'
      };
      const createdUser = { id: 1, ...userData };
      
      mockRequest.body = userData;
      mockUserService.create.mockResolvedValue(createdUser);

      // Act
      await userController.createUser(
        mockRequest as DRequest, 
        mockResponse as DResponse
      );

      // Assert
      expect(mockUserService.create).toHaveBeenCalledWith(userData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });
  });
});
```

#### Integration Testing

##### Testing HTTP Endpoints

```typescript
// tests/integration/user.integration.test.ts
import request from 'supertest';
import { DolphFactory } from '@dolphjs/dolph';
import { UserComponent } from '../../src/components/user.component';
import { initMongo } from '@dolphjs/dolph';

describe('User Integration Tests', () => {
  let app: any;
  let server: any;

  beforeAll(async () => {
    // Setup test database
    await initMongo({
      url: process.env.TEST_MONGO_URL || 'mongodb://localhost:27017/test_db'
    });

    // Create app instance
    const dolph = new DolphFactory([UserComponent]);
    app = dolph.getApp();
    server = app.listen(0); // Random port
  });

  afterAll(async () => {
    await server.close();
  });

  beforeEach(async () => {
    // Clean database before each test
    await clearDatabase();
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      // Arrange
      const userData = {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123'
      };

      // Act
      const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(201);

      // Assert
      expect(response.body).toMatchObject({
        statusCode: 201,
        data: {
          username: userData.username,
          email: userData.email
        }
      });
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should return 400 for invalid data', async () => {
      // Arrange
      const invalidData = {
        username: '', // Invalid: empty username
        email: 'invalid-email', // Invalid: not an email
        password: '123' // Invalid: too short
      };

      // Act
      const response = await request(app)
        .post('/users')
        .send(invalidData)
        .expect(400);

      // Assert
      expect(response.body).toMatchObject({
        statusCode: 400,
        message: expect.stringContaining('Validation failed')
      });
    });

    it('should return 409 for duplicate email', async () => {
      // Arrange
      const userData = {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123'
      };

      // Create user first
      await request(app).post('/users').send(userData);

      // Act - try to create user with same email
      const response = await request(app)
        .post('/users')
        .send({
          ...userData,
          username: 'different_username'
        })
        .expect(409);

      // Assert
      expect(response.body.message).toContain('already exists');
    });
  });

  describe('GET /users/:id', () => {
    it('should return user when found', async () => {
      // Arrange
      const userData = {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123'
      };
      
      const createResponse = await request(app)
        .post('/users')
        .send(userData);
      
      const userId = createResponse.body.data.id;

      // Act
      const response = await request(app)
        .get(`/users/${userId}`)
        .expect(200);

      // Assert
      expect(response.body.data).toMatchObject({
        id: userId,
        username: userData.username,
        email: userData.email
      });
    });

    it('should return 404 for non-existent user', async () => {
      // Act
      const response = await request(app)
        .get('/users/nonexistent-id')
        .expect(404);

      // Assert
      expect(response.body.message).toContain('not found');
    });
  });
});

// Test utilities
async function clearDatabase() {
  // Clear all collections
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
}
```

#### Authentication Testing

```typescript
// tests/auth/auth.test.ts
import request from 'supertest';
import { generateJWTwithHMAC } from '@dolphjs/dolph';

describe('Authentication Tests', () => {
  let app: any;
  let authToken: string;

  beforeAll(async () => {
    // Setup app
  });

  beforeEach(async () => {
    // Create test user and get auth token
    const testUser = await createTestUser();
    authToken = generateJWTwithHMAC({
      payload: { sub: testUser.id, role: 'user' },
      secret: process.env.JWT_SECRET || 'test-secret'
    });
  });

  describe('Protected Routes', () => {
    it('should allow access with valid token', async () => {
      await request(app)
        .get('/protected-route')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('should deny access without token', async () => {
      await request(app)
        .get('/protected-route')
        .expect(401);
    });

    it('should deny access with invalid token', async () => {
      await request(app)
        .get('/protected-route')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('Role-based Access', () => {
    it('should allow admin access to admin routes', async () => {
      const adminToken = generateJWTwithHMAC({
        payload: { sub: 'admin-id', role: 'admin' },
        secret: process.env.JWT_SECRET || 'test-secret'
      });

      await request(app)
        .get('/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });

    it('should deny user access to admin routes', async () => {
      await request(app)
        .get('/admin/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);
    });
  });
});
```

#### Database Testing

##### MongoDB Memory Server

```typescript
// tests/setup/database.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import { initMongo } from '@dolphjs/dolph';

let mongoServer: MongoMemoryServer;

export async function setupTestDatabase() {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  await initMongo({
    url: uri,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  });
}

export async function teardownTestDatabase() {
  if (mongoServer) {
    await mongoServer.stop();
  }
}

export async function clearTestDatabase() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
}
```

#### Test Utilities and Helpers

```typescript
// tests/utils/test-helpers.ts
import { DRequest, DResponse } from '@dolphjs/dolph';

export function createMockRequest(overrides: Partial<DRequest> = {}): DRequest {
  return {
    params: {},
    query: {},
    body: {},
    headers: {},
    method: 'GET',
    url: '/',
    ...overrides
  } as DRequest;
}

export function createMockResponse(): DResponse {
  const res = {} as DResponse;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  return res;
}

export async function createTestUser(userData?: Partial<any>) {
  return {
    id: 'test-user-id',
    username: 'testuser',
    email: 'test@example.com',
    ...userData
  };
}

export function createAuthToken(payload: any) {
  return generateJWTwithHMAC({
    payload,
    secret: process.env.JWT_SECRET || 'test-secret'
  });
}
```

#### End-to-End Testing

```typescript
// e2e/user-workflow.e2e.test.ts
import request from 'supertest';

describe('User Workflow E2E', () => {
  let app: any;

  beforeAll(async () => {
    // Setup full application
  });

  it('should complete full user registration and login flow', async () => {
    const userData = {
      username: 'e2e_user',
      email: 'e2e@example.com',
      password: 'password123'
    };

    // Step 1: Register user
    const registerResponse = await request(app)
      .post('/auth/register')
      .send(userData)
      .expect(201);

    expect(registerResponse.body.data).toHaveProperty('id');
    const userId = registerResponse.body.data.id;

    // Step 2: Login
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: userData.email,
        password: userData.password
      })
      .expect(200);

    expect(loginResponse.body.data).toHaveProperty('token');
    const token = loginResponse.body.data.token;

    // Step 3: Access protected profile
    const profileResponse = await request(app)
      .get('/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(profileResponse.body.data).toMatchObject({
      id: userId,
      username: userData.username,
      email: userData.email
    });

    // Step 4: Update profile
    const updateData = { username: 'updated_username' };
    const updateResponse = await request(app)
      .put('/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send(updateData)
      .expect(200);

    expect(updateResponse.body.data.username).toBe(updateData.username);
  });
});
```

#### Performance Testing

```typescript
// tests/performance/load.test.ts
describe('Performance Tests', () => {
  it('should handle concurrent requests', async () => {
    const concurrentRequests = 100;
    const requests = [];

    for (let i = 0; i < concurrentRequests; i++) {
      requests.push(
        request(app)
          .get('/users')
          .expect(200)
      );
    }

    const startTime = Date.now();
    await Promise.all(requests);
    const endTime = Date.now();

    const duration = endTime - startTime;
    console.log(`${concurrentRequests} requests completed in ${duration}ms`);
    
    // Assert reasonable performance
    expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
  });
});
```

#### Test Coverage and Quality

```bash
# Run tests with coverage
npm run test:coverage

# Generate coverage report
npm run test:coverage:report

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e

# Watch mode for development
npm run test:watch
```

#### Best Practices

1. **Test Structure**: Follow AAA pattern (Arrange, Act, Assert)
2. **Test Isolation**: Each test should be independent
3. **Descriptive Names**: Test names should clearly describe what they test
4. **Mock External Dependencies**: Use mocks for databases, APIs, etc.
5. **Test Edge Cases**: Include boundary conditions and error scenarios
6. **Maintain Test Data**: Use factories or fixtures for consistent test data
7. **Performance Testing**: Include load tests for critical paths
8. **CI/CD Integration**: Automate test execution in deployment pipeline

Testing ensures your DolphJS applications are reliable, maintainable, and bug-free. A comprehensive testing strategy gives you confidence when deploying to production and makes refactoring safer. 