### Middlewares

A middleware is a function that executes before the route handler. It allows you to run additional logic, modify the **request** or **response** objects, or terminate the **request-response** cycle. Middleware is essential for enhancing the functionality, security, and customization of APIs.

<figure><img src="/assets/images/middlewares.png"/></figure>

Middlewares can be attached to any controller method that serves as a route. You can achieve this using the `@UseMiddleware decorator`, as shown below:

The **@UseMiddleware** decorator in the Dolph framework allows you to attach middleware functions to specific controller methods. This enables additional processing, validation, or other operations on requests before they reach your controller logic.

```typescript
@@filename(logger.middleware.ts)
import { DRequest, DResponse, DNextFunc } from "@dolph/dolph/common";

const loggingMiddleware = (req: DRequest, res: DResponse, next: DNextFunc) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

export default loggingMiddleware;
```

```typescript
@@filename(test.controller.ts)

class TestController {
  @Post('test')
  @UseMiddleware(loggingMiddleware)
  async testNewController(req: DRequest, res: DResponse) {
    const dto: CreateUserDto = req.body;
    SuccessResponse({ res, body: { dto, ...req.payload } });
  }
}
```


### Global Middlewares

A global middleware is a middleware that is not restricted to specific controller methods but runs on every request. This can include security middlewares such as rate-limiting, XSS-cleaning, and more.

Registering a global middleware in your Dolph server is straightforward, as demonstrated below using the Helmet security package:


```typescript
@@filename(server.ts)

import { DolphFactory, middlewareRegistry } from '@dolphjs/dolph/common';
import helmet from 'helmet';

middlewareRegistry.register(helmet());

const dolph = new DolphFactory();

dolph.start();
```

calling the `register` method and passing the middleware as a param registers the middleware.

> info **Hint** All Global middlewares must be registered before calling the `DolphFactory` class.