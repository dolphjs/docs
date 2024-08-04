### Rate Limiting

Rate limiting is often used to protect applications from brute-force attacks by controlling the rate of requests sent or received by the server. It can be used to prevent DoS attacks and limit web scraping.

Currently, there is no class provided by dolphjs for implementing **rate-limiting**. This is one of the next features to be included in the next first releases.

However, using the [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) package, we can implement rate limiting:

## Implementing local level Rate limiting

`shared/middlewares/rate_limit.middleware.ts`

```typescript
import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";

class RateLimiterClass {

  init(): RateLimitRequestHandler {

    const limiter = rateLimit({
      windowMs: 6 * 1000, // 6 seconds
      max: 2, // limit each IP to 2 requests per windowMs
      message: "Too many requests, please try again later.",
    });
    return limiter;
  }
}

export const RateLimiter = new RateLimiterClass();

```

Now, let us call use middleware in our controller:

`user.controller.ts`

```typescript

import { DolphControllerHandler } from "@dolphjs/dolph/classes";
import { Patch, Route, Shield, UseMiddleware } from "@dolphjs/dolph/decorators";
import { Dolph, SuccessResponse, DRequest, DResponse } from "@dolphjs/dolph/common";
import { RateLimiter } from "@/shared/middlewares/rate_limit.middleware";
import { UserService } from "./user.service";
import { Role } from "./roles.enum.ts";


@Shield([AuthShield, Authorize(Role.User)])
@Route("user")
export class AuthController extends DolphControllerHandler<Dolph>{
    private UserService: UserService;
    constructor(){
        super();
    }

    @Patch("update")
    @UseMiddleware(RateLimiter.Init())
    updateProfile(req: DRequest, res: DResponse) {
        const { bio }: { bio: string} = req.body;

        const result = this.UserService.findOneByUsernameAndUpdate(user.sub, bio);

        SuccessResponse({ res, body: { msg: "User profile updated successfully", data: result } });
    };
};
```

### Global Rate Limiting

You can also register the rate limiter globally:

`server.ts`

```typescript
import { DolphFactory, middlewareRegistry } from "@dolphjs/dolph";
import { RateLimiter } from "./shared/middlewares/rate_limit.middleware";
import { UserComponent } from "./components/user/user.component.ts";

middlewareRegistry.register(RateLimiter.init());

const dolph = new DolphFactory([UserComponent]);

dolph.start();
```
