### Services

Services are a core concept in Dolph and central to its architecture. A service is any class that extends the `DolphServiceHandler` class. These classes handle direct communication with databases, third-party APIs, and more. Typically, a service class will have the relevant database model(s) registered to it.

The purpose of a service class is to consolidate all code related to a particular controller into a single service, allowing methods to share code and functionality.

Let’s walk through a sample service class for a ***user*** entity:

```typescript
@@filename(user.service)
import { DolphServiceHandler } from "@dolphjs/dolph/classes";
import { Dolph } from "@dolphjs/dolph/common";
import { User } from "./user.interface";

export class UserService extends DolphServiceHandler<Dolph> {
  private readonly users: User[] = [];
  constructor() {
    super("userservice");
  }

  create(user: User){
    this.users.push(user);
  }

  fecthAll(): User[]{
    return this.users;
  }

  fetchOne(name: string): User {
    return this.users.find(user => user.name === name);
  }
}
```

> info **Hint** To create a service using the CLI, simply execute the `$ dolph g -s user` command. 

The `UserService` class is a basic example of a service class. Here is what the `User` interface looks like:

```typescript
@@filename(user.interface)
export interface User{
    name: string;
    age: number;
    country: string;
}
```

We have to register the `UserService` class in our component in order to make use of it within our controller:

```typescript
@@filename(user.component.ts)

@Component({ controllers: [UserController], services: [UserService] })
export class UserComponent {}
```


```typescript
@@filename(user.controller.ts)
import { DolphControllerHandler } from "@dolphjs/dolph/classes";
import {
  Dolph,
  SuccessResponse,
  DRequest,
  DResponse,
  NotFoundException
} from "@dolphjs/dolph/common";
import { Get, Post, Route } from "@dolphjs/dolph/decorators";
import { UserService } from "./user.service";


@Route('user')
export class UserController extends DolphControllerHandler<Dolph> {
  private UserService: UserService;

  @Post("new")
  async newUser(req: DRequest, res: DResponse): Promise<void>{
    this.UserService.create(req.body);
    SuccessResponse({res, body: {message: "user created successfully"}});
  }

  @Get(":name")
  async getUser(req: DRequest, res:DResponse): Promise<void>{
    const result = this.UserService.fetchOne(req.params.name);
    if(!result) throw new NotFoundException("user not found");
    SuccessResponse({res, body: result});
  }
}
```

Any service registered in a component is accessible to all controllers within that component. The name given to the service in the controller class must match its name exactly. For example, a service named UserService should be referred to as **UserService** in the controller class, not as ***userService*** or any other variation.

This is what our directory structure looks like now:

<div class="file-tree">
 <div class="item">src</div>
  <div class="children">
    <div class="item">components</div>
        <div class="item">user</div>
        <div class="children">
            <div class="item">user.component.ts</div>
            <div class="item">user.controller.ts</div>
            <div class="item">user.interface.ts</div>
            <div class="item">user.service.ts</div>
        </div>
    <div class="item">shared</div>
    <div class="item">server.ts</div>
  </div>
</div>