### Shields

A shield is a specialized middleware decorator used to attach authentication and authorization middleware at the controller level. This means it affects all methods (routes) within the controller class.

Currently, it has limited functionality, but with the introduction of version **1.6**, the Dolph shield package will be available to handle authentication and authorization in a more streamlined and user-friendly manner.

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