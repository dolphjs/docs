### Services

Services are one of the most important concepts in Dolph and it's entire architecture. A service is any class that extends the `DolphServiceHandler` class. These classes are responsible for direct communication with databases, third-party APIs e.t.c. A service class would usually have the database model(s) registered to them. 

The idea behing a service class is that all code directly related to a particular controller should be written in a single service so that the methods implement code that is sharable between each other.

Let's work through a sample service class for a **user** entity:

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

> info **Hint** Any service registered in the component is accessible to all the controllers registered in that component. The name given to the service on the controller class has to be the same as it's name in order to work, i.e a service by  name `UserService` should not be inferred as userService or service on the controller class but as **UserService**.

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