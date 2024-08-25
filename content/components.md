### Components

A component in Dolph is a specialized class used to organize the application structure and maintain the MVC pattern. It is identified by the `@Component` decorator. Controllers and services associated with an entity are registered within the component for that entity, and all components are registered in the `server.ts` file.

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

> info **Hint** Each entity must have a component that registers its associated controller(s) and service(s). All components are then registered in the `server.ts` file.
