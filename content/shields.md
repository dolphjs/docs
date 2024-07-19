## Shields

A shield is a fancy middleware decorator that is used to attach mainly authentication and authorization middlewares to the controller at the top level, meaning that it affects all the methods (routers) under the controller class.

It does not really have many **out-of-the-box** use yet until version `1.6` when the dolph **shield** package would be introduced to handle authentication and authorization in a fancy and simple fashion.

`@dolphjs/shield`

### Usage

```typescript

import { DNextFunc, DRequest, DResponse } from '@dolphjs/dolph/common';

export const testMiddleware = (req: DRequest, res: DResponse, next: DNextFunc) => {
  req.payload = {
    sub: 'name',
    exp: 0,
    iat: 0,
  };
  next();
};

```

```typescript

import { Route, Shield, Get } from "@dolphjs/dolph/decorators";
import { payloadMiddleware } from "./payload_middleware.ts";

@Shield(payloadMiddleware)
@Route('app')
export class NewController extends DolphControllerHandler<Dolph> {
  private NewService: NewService;

  constructor() {
    super();
  }

 @Get()
  async get(req: DRequest, res: DResponse){
    console.log(req.payload);
  }
}
```