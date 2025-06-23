### Utilities

DolphJS provides a comprehensive set of utility functions and classes to handle common application requirements like authentication, encryption, validation, file handling, and more.

#### Authentication Utilities

##### JWT Token Generation and Verification

DolphJS supports both HMAC and RSA-based JWT tokens:

```typescript
import { 
  generateJWTwithHMAC, 
  verifyJWTwithHMAC,
  generateJWTwithRSA,
  verifyJWTwithRSA 
} from '@dolphjs/dolph';

// HMAC JWT (Symmetric encryption)
const token = generateJWTwithHMAC({
  payload: { 
    sub: 'user123', 
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    iat: Math.floor(Date.now() / 1000),
    role: 'admin'
  },
  secret: 'your-secret-key'
});

// Verify HMAC JWT
const payload = verifyJWTwithHMAC({
  token: token,
  secret: 'your-secret-key'
});

// RSA JWT (Asymmetric encryption)
const rsaToken = generateJWTwithRSA({
  pathToPrivateKey: './keys/private.pem',
  payload: { 
    sub: 'user123', 
    exp: Date.now() + 3600000,
    permissions: ['read', 'write']
  }
});

// Verify RSA JWT
const rsaPayload = verifyJWTwithRSA({
  token: rsaToken,
  pathToPublicKey: './keys/public.pem'
});
```

##### Cookie Authentication Utilities

Create secure authentication cookies with built-in signing and validation:

```typescript
import { newAuthCookie } from '@dolphjs/dolph';

// Create authentication cookie
const cookie = newAuthCookie(
  'user123',                    // user ID
  3600000,                     // expiration in milliseconds
  'secret-signing-key',        // secret for signing
  { role: 'admin', dept: 'IT' } // additional payload
);

// Set cookie in response
res.cookie(cookie.name, cookie.value, {
  expires: cookie.expires,
  secure: cookie.secure,       // HTTPS only
  httpOnly: cookie.httpOnly,   // Prevent XSS
  sameSite: 'strict'          // CSRF protection
});
```

#### Encryption Utilities

##### Password Hashing with Bcrypt

Secure password hashing and verification:

```typescript
import { hashString, compareHashedString } from '@dolphjs/dolph';

// Hash password with salt rounds
const hashedPassword = await hashString('plainPassword', 12);

// Verify password
const isValid = await compareHashedString('plainPassword', hashedPassword);

// Example usage in authentication
export class AuthService {
  async register(email: string, password: string) {
    const hashedPassword = await hashString(password, 12);
    return this.userRepository.create({ email, password: hashedPassword });
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await compareHashedString(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }
}
```

#### Validation Utilities

##### Password Validation

Comprehensive password strength validation:

```typescript
import { validatePassword } from '@dolphjs/dolph';

// Password validation with custom rules
const validation = validatePassword('strong', 'user_password', {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  specialChars: ['!', '@', '#', '$', '%', '^', '&', '*']
});

if (!validation.isValid) {
  throw new BadRequestException(validation.message);
}
```

#### Logger Utilities

Advanced logging with multiple transports and formatting:

```typescript
import { logger, inAppLogger } from '@dolphjs/dolph';

// Application logging
logger.info('Application started successfully');
logger.error('Database connection failed', { 
  error: 'Connection timeout',
  retryAttempts: 3 
});
logger.warn('Deprecated API endpoint used', { 
  endpoint: '/api/v1/users',
  userAgent: req.headers['user-agent']
});
logger.debug('User authentication process', { 
  userId: 'user123',
  timestamp: new Date().toISOString()
});

// Framework internal logging
inAppLogger.info('Registered >>>> Route: GET /api/users');
inAppLogger.warn('Middleware registration order may affect performance');
```

#### Data Manipulation Utilities

##### Object Picking and Filtering

```typescript
import { pick } from '@dolphjs/dolph';

// Extract specific properties from objects
const userFilters = pick(req.query, ['limit', 'page', 'sort', 'filter']);
// Result: { limit: 10, page: 1, sort: 'name', filter: 'active' }
``` 