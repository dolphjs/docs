### Authentication

Authentication is one of the core features of most software out there. Just like most concepts in software development, there are mostly always different ways to accomplish a goal depending on the requirements of the system, and that is the same case with **Authentication**. The most common implementation of Authentication is usually with the use of username or email and password combination. Upon authentication, the server sends an authentication token to the authenticated client, and this token is requested by the server on subsequent requests in order for the client to access resources on the server.

>info **Note** the `auth` package would be out together with the version 1.6 of Dolph.

### Creating and registering the authentication component

A component is a directory under the `src` directory that contains at least these three files: 

- controller.ts
- service.ts
- component.ts

We'll do this with the CLI

```bash
$ dolph g -a auth
```

We would delete the generated `auth.model.ts` file as we wouldn't be making use of it for this example.

Remember to register your component in the `server.ts` file and your service file in the `auth.component.ts` file so that they are available for use and recognized by the Dolph engine.

auth.component.ts

```typescript

import { Component } from "@dolphjs/dolph/decorators";
import { Dolph, IPayload } from "@dolphjs/dolph/common";
import { generateJWTwithHMAC } from "@dolphjs/dolph/utilities";
import { AuthController } from "./auth.controller.ts";
import { AuthService } from "./auth.service.ts";
import moment from "moment";


@Component({controllers: [AuthController], services: [AuthService]})
export class AuthComponent {};
```


### Writing the signIn service method

auth.service.ts

```typescript
import { DolphServiceHandler } from "@dolphjs/dolph/classes";
import {
  UnAuthorizedException,
  Dolph,
} from "@dolphjs/dolph/common";

export interface IUser{
    id: number;
    username: string;
    password: string;
}

export interface IAuthPayload{
    user: IUser,
    token: string;
}

export class AuthService extends DolphServiceHandler<Dolph> {

    private users: IUser[] = [
        {
            id: 1,
            username: "utee",
            password: "veryStrongPassword"
        },
        {
            id: 2,
            username: "chris",
            password: "veryWeakPassword"
        },
        {
            id: 3,
            username: "paul",
            password: "superWeakPassword"
        }
    ]

    constructor(){
        super("authService");
    }

    private readonly getUserByUsername = async (username: string): Promise<IUser | undefined> => {
        return this.users.find(user => user.username === username);
    };

    private signToken(username: string, expires: moment.Moment): string {
        const payload: IPayload = {
        exp: expires.unix(),
        sub: username,
        iat: moment().unix(),
    };

    return generateJWTwithHMAC({ payload, secret: "JwtSecretVerySafeSecret" });
  }

    public readonly signIn  = async (username: string, password: string): Promise<IAuthPayload> => {
        const user = await this.getUserByUsername(username);

        if(!user) throw new UnAuthorizedException("Invalid login credentials");

        if(user.password !== password) throw new UnAuthorizedException("Invalid login credentials");

        const expiresAt = moment().add(60, "minutes"); // the token expires after an hour

        const token: string = this.signToken(user.username, expiresAt);

        return {
            user,
            token,
        }
    };
};
```

> warn **Warning** never store password as plain text, make sure to check this [page](https://docs.dolph.com/security/encryption-and-hashing) to learn how to hash and compare passwords the [standard way](https://medium.com/@cmcorrales3/password-hashes-how-they-work-how-theyre-hacked-and-how-to-maximize-security-e04b15ed98d)


### Writing the signIn endpoint in our controller class

Having our service class, let's make use of it in the **AuthController**.

```typescript
import { DolphControllerHandler } from "@dolphjs/dolph/classes";
import { Post, Route } from "@dolphjs/dolph/decorators";
import { Dolph, SuccessResponse, DRequest, DResponse } from "@dolphjs/dolph/common";
import { AuthService } from "./auth.service";

@Route("auth")
export class AuthController extends DolphControllerHandler<Dolph>{
    private AuthService: AuthService;
    constructor(){
        super();
    }

    @Post("signin")
    signIn(req: DRequest, res: DResponse) {

        const { username, password }: { username: string, password: string } = req.body;

        const result = this.AuthService.signIn(username, password);

        SuccessResponse({ res, body: { msg: "Client signed In successfully", data: result } });
    };
};
```

> info **Hint** Make sure to always use validation middlewares in your controllers. Also, you shouldn't use the `AuthService` to interact directly with the `user` entity. Usually, a **UserService** should exist which does this then is used by the **AuthService** and/or **AuthController**

### Implementing the auth shield

A shield is a decorator used for applying auth middlewares to all endpoints of a controller. You might be wondering what you'll do if there is a controller-method that shouldn't have the auth shield applied to it and yes, there is a way to exempt a method from being shielded and that is by using the **@UnShield** decorator on the controller-method.

We will assume that we have a user service with the method `findOneByUsernameAndUpdate` which accepts two parameters, the *username* and the *bio*. It uses the username to update a user's bio, meaning that our `IUser` would be updated to look like this:

```typescript

export interface IUser{
    id: number;
    username: string;
    password: string;
    bio?: string;
}
```

Let's go on and create a very basic auth middleware which does not allow unauthenticated users access to the endpoints under the controller it's applied on:

```typescript
import {
  DNextFunc,
  DRequest,
  DResponse,
  ForbiddenException,
  IPayload,
  UnauthorizedException,
} from "@dolphjs/dolph/common";
import { verifyJWTwithHMAC } from "@dolphjs/dolph/utilities";

export const AuthShield = async (
  req: DRequest,
  res: DResponse,
  next: DNextFunc
) => {
  try {
    let authToken = req.headers["Authorization"] as string;

    if (!authToken) {
      return next(
        new UnauthorizedException("Provide a valid authorization token header")
      );
    }

    const bearer = authToken.split(" ")[0];

    if (bearer !== "Bearer")
      return next(
        new UnauthorizedException("Provide a valid authorization token header")
      );

    authToken = authToken.split(" ")[1];

    let payload: IPayload;

    payload = verifyJWTwithHMAC({
      token: authToken,
      secret: "oursecret",
    });

    if (!payload)
      return next(new UnauthorizedException("Invalid or expired token"));

    req.payload = payload;

    next();
  } catch (e: any) {
    next(new UnauthorizedException(e));
  }
};

```

The above middleware function checks for the `Authorization` header, if not found or is invalid, it throws an error, if it's valid, it verifies and decodes it by passing the token (the value of the header) to the `verifyJWTwithHMAC` function. It then stores the decoded payload in the req object as `req.payload`.

>info **Hint** Usually, there is always more to do but we are keeping it simple and straightforward.

Now, we can make use of the `AuthShield` to prevent unauthenticated users as shown below:

```typescript
import { DolphControllerHandler } from "@dolphjs/dolph/classes";
import { Patch, Route, Shield } from "@dolphjs/dolph/decorators";
import { Dolph, SuccessResponse, DRequest, DResponse } from "@dolphjs/dolph/common";
import { UserService } from "./user.service";

@Shield(AuthShield)
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

> Info **Hint** In the case where you have one or more controller-methods which you want an unauthenticated user to have access to, you attach the `UnShield` decorator with the middleware(s) to be exempted as param and it'll not be affected by the shield decorator.

### Example

You can take a look at our sample [project](https://github.com/dolphjs/projects) to understand better.

> Info **Hint** The Shield and UnShield decorators accept a middleware or an array of middlewares.
