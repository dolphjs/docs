### Authorization

In software development, **authorization** is literally the process of giving authority to users over a scope of actions. Fo instance, an admin is given authority to create, update, read, and delete resources while a normal user might be limited to only reading of resources on a system.

Authorization requires an authentication process in order to be enforced because you will most likely need to identify the user first before knowing what scopes to authorize the user over.

There are a number of **authorization** approaches which are enforced depending on the nature or requirements of the application. We would discuss the most common of them `Role-based Access Control (RBAC)`.

DolphJs is yet to have an `auth` package which is said to be released together with the version `1.6` of the dolph core package, and until then we don't have  a  *dolph way* of performing these authentications but we can give a guide:


### Role-based Access Control Implementation

Role-based access control (**RBAC**) is a policy-neutral access control mechanism defined around roles and privileges. The components of RBAC such as role-permissions, user-role and role-role relationships make it simple to perform user assignments.

We will demonstrate how to make use of [middlewares](https://docs.dolphjs/middlewares) to implement a basic example of **RBAC** .

We can represent the different roles in our app using an enum:

`roles.enum.ts`

```typescript
export enum Role {
    User = "USER",
    Admin = "ADMIN"
}
```

Let's have an `authorize.middleware.ts` file:

```typescript
import {
  DNextFunc,
  DRequest,
  DResponse,
  ForbiddenException,
  IPayload,
  UnauthorizedException,
} from "@dolphjs/dolph/common";

export interface IUser {
  id: number;
  username: string;
  password: string;
  role: string;
}

export const Authorize =
  (role: string) => async (req: DRequest, res: DResponse, next: DNextFunc) => {
    try {
      const payload: IPayload | undefined = req.payload;

      if (!payload) throw new UnauthorizedException("Not Authenticated");

      /**
       * Assuming the user has been authenticated and the user data was passed to the `payload.info` property
       */

      const info = payload.info as IUser;

      if (info.role !== role)
        throw new ForbiddenException(
          "Your are forbidden from accessing this resource"
        );

      next();
    } catch (e: any) {
      next(e);
    }
  };

```

> Warning **Notice** We assume that the `req.payload.info` property holds our user data and if you remember, from the [authentication](https://dolphjs.com/authentication) module, we said that usually there is always more to the authentication shield and that includes fetching the user data from the database using the key (in the case of that example, it's the `username`) and then setting the `req.payload.info` property with the user data for easy access within the application. In other nodejs frameworks, it's mostly added to the `req.user` property.

Now, let's update the example from the [authentication](https://dolphjs.com/authentication)  module to implement authorization:

```typescript
import { DolphControllerHandler } from "@dolphjs/dolph/classes";
import { Patch, Route, Shield } from "@dolphjs/dolph/decorators";
import { Dolph, SuccessResponse, DRequest, DResponse } from "@dolphjs/dolph/common";
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
    updateProfile(req: DRequest, res: DResponse) {
        const { bio }: { bio: string} = req.body;

        const result = this.UserService.findOneByUsernameAndUpdate(user.sub, bio);

        SuccessResponse({ res, body: { msg: "User profile updated successfully", data: result } });
    };
};
```

> Warning **Notice** The order of insertion of the shields in the `@Shield` decorator matters. If you place the `Authorize` shield before the `AuthShield` then the `req.payload` object would not be available for the shield and it would result in an unwanted code behaviour.

As shown above, the `Authorize` middleware is used as a shield. It can also be used as a middleware instead:

```typescript

import { DolphControllerHandler } from "@dolphjs/dolph/classes";
import { Patch, Route, UseMiddleware, Shield } from "@dolphjs/dolph/decorators";
import { Dolph, SuccessResponse, DRequest, DResponse } from "@dolphjs/dolph/common";
import { UserService } from "./user.service";
import { Role } from "./roles.enum.ts";

@Shield(AuthShield)
@Route("user")
export class AuthController extends DolphControllerHandler<Dolph>{
    private UserService: UserService;
    constructor(){
        super();
    }

    @Patch("update")
    @UseMiddleware(Authorize(Role.User))
    updateProfile(req: DRequest, res: DResponse) {
        const { bio }: { bio: string} = req.body;

        const result = this.UserService.findOneByUsernameAndUpdate(user.sub, bio);

        SuccessResponse({ res, body: { msg: "User profile updated successfully", data: result } });
    };
};
```

> info **Hint** When using the `TryCatchAsyncDec` decorator, it should be placed below the `@UseMiddleware` decorator for the middlewares to work.

There are other ways of implementing authorization and different libraries offered to integrate them. We will update this module soon with other examples. We promise that the upcoming `dolpjs/auth` package would come with support for these and easy implementation.
