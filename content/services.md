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

Now, we can link and integrate the `UserService` and `UserController` classes together to build an actual API.

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

const service =  new UserService();

@Route('user')
export class UserController extends DolphControllerHandler<Dolph> {

  @Post("new")
  async newUser(req: DRequest, res: DResponse): Promise<void>{
    service.create(req.body);
    SuccessResponse({res, body: {message: "user created successfully"}});
  }

  @Get(":name")
  async getUser(req: DRequest, res:DResponse): Promise<void>{
    const result = service.fetchOne(req.params.name);
    if(!result) throw new NotFoundException("user not found");
    SuccessResponse({res, body: result});
  }
}
```

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