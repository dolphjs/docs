### Middlewares

A middleware is basically a function that runs before the route handler. They provide a way to execute additional logic, modify the **request** or **response** objects, or terminate the **request-response** cycle. Middleware plays a crucial role in enhancing the functionality, security, and customization of APIs.

<figure><img src="/assets/images/middlewares.png"/></figure>

Middlewares can be attached to every controller method which serves as a router. Using the `@UseMiddleware` decorator to achieve this as shown below:

The **@UseMiddleware** decorator in the Dolph framework allows you to attach middleware functions to specific controller methods. This enables you to apply additional processing, validation, or other operations to requests before they reach your controller logic.

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

A global middleware is a middleware that isn't restricted to a particular controller method or set of controller methods but runs on every request. These could include security middlewares like rate-limiting middlewares, xss-cleaning middlewares, e.t.c.

Registering a global middleware into your dolph server is very easy and is shown below using the helmet security package:


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