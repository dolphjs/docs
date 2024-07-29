## Authorization

Authorization is one of the core features of most software out there. Just like most concepts in software development, there are mostly always different ways to accomplish a goal depending on the requirements of the system, and that is the same case with **Authorization**. The most common implementation of Authorization is usually with the use of username or email and password combination. Upon authentication, the server sends an authorization token to the authenticated client, and this token is requested by the server on subsequent requests in order for the client to access resources on the server.

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

> info **Hint** Make sure to always use validation middlewares in your controllers.

### Implementing the auth shield

A shield is a decorator used for applying auth middlewares to all endpoints of a controller. You might be wandering what you'll do if there is a controller-method that shouldn't have the auth shield applied to it and yes, there is a way to exempt a method from being shielded and that is by using the **@unshield** decorator on the controller-method.

