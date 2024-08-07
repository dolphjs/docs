### Components

A component is a special Dolph class that is used to organize the application structure and maintain the MVC. It is marked by the `@Component` decorator. All controllers and services belonging to an entity are registered in the entity's component and all components are registered in the `server.ts` file.

<figure><img src="/assets/images/component.png"/></figure>

This is what a component looks like:

```typescript
@@filename(user.component)
import { Component } from "@dolphjs/dolph/decorators";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Component({ controllers: [UserController], services: [UserService] })
export class UserComponent {}
```

And the component is registered in the `server.ts` file just like this:

```typescript
@@filename(server)
import { DolphFactory } from "@dolphjs/dolph";
import { UserComponent } from "./components/user/user.component";

const dolph = new DolphFactory([UserComponent]);
dolph.start();
```

> info **Hint** Each entity is required to have a component which registers the controller(s) and service(s) and all components are registered in the `server.ts` file.