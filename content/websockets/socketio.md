### Socket IO

Currently,  Dolph supports both `Ws` and `Socket.IO` but only offers out of the box support for [Socket.IO](https://www.npmjs.com/package/socket.io). It is very easy to setup and initialize **socket.io** in a Dolph application.

We would be making use of the CLI to generate a socket service:

```bash
$ dolph g -soc events
```

The above command would create an `events.socket.service.ts` file in the directory path `/src/shared/socket`. If you ran the command, you should get something that looks exactly like this in the socket service file created:

```typescript
import { DolphSocketServiceHandler } from '@dolphjs/dolph/classes';
import { Dolph } from '@dolphjs/dolph/common';

export class EventsSocketService extends DolphSocketServiceHandler<Dolph> {
  constructor() {
    super();
    this.socketService;
    this.handleEvents();
  }

  private handleEvents() {
    this.socket.on('connection', (socket) => {
      socket.emit('connected', 'connection successful');
    });
  }
}
```
Next, we need to register this `EventsSocketService` in the sockets component. In the same directory as `events.socket.service.ts`, create a **socket.component.ts** file and register the socket service class:

```ts
import { Socket } from "@dolphjs/dolph/decorators";
import { SocketComponent } from "@dolphjs/dolph/packages";
import { EventsSocketService } from "./events.socket.service";

@Socket({ services: [], socketServices: [EventsSocketService] })
export class EventSocketComponent extends SocketComponent {}
```

The `@Socket` decorator registers the socket services in the `socketServices` array globally so that it can be accessed upon Dolph server initialization.

And Finally, we need to register the component in our `server.ts` file:

```typescript
import { DolphFactory } from "@dolphjs/dolph";
import { Dolph } from "@dolphjs/dolph/common";
import { DSocketInit } from "@dolphjs/dolph/common/interfaces/socket.interfaces";
import { EventSocketComponent } from "./shared/socket/socket.component";
import { SocketService } from "@dolphjs/dolph/packages";

const socketConf: DSocketInit<Dolph> = {
  component: new EventSocketComponent(),
  socketService: SocketService,
  options: { cors: { origin: "*" } },
};

const dolph = new DolphFactory([], socketConf);
dolph.start();
```

We are all setup, start your server and make a socket.io request to your server PORT while listening to a `connected` message and you'll receive a **connection successful** message.

#### Interacting With Component Services 

In  a lot of cases, you will need to interact with component service classes to handle events. In order to achieve this, you'll first need to register these services in the `service` field of the `@Socket` decorator.

Let's create a user component using the command : `$ dolph g -a user` and modify the `user.service.ts` file under the created component:

```typescript
import { DolphServiceHandler } from "@dolphjs/dolph/classes";
import { Dolph } from "@dolphjs/dolph/common";

interface IUser {
  clientId: string;
  name: string;
}

export class UserService extends DolphServiceHandler<Dolph> {
  private users: IUser[] = [];

  constructor() {
    super("userservice");
  }

  public addUser(dto: IUser) {
    this.users.push(dto);
  }

    public getUser(clientId: string) {
    return this.users.filter((user) => user.clientId === clientId)[0];
  }
}
```

Our service file has two methods: **addUser** and **getUser** which adds a new user to the `users` array and fetch's a user by name from the array respectively.

Let's update out `socket.component.ts` file:

```typescript
import { Socket } from "@dolphjs/dolph/decorators";
import { SocketComponent } from "@dolphjs/dolph/packages";
import { EventsSocketService } from "./events.socket.service";
import { UserService } from "@/components/user/user.service";

@Socket({ services: [UserService], socketServices: [EventsSocketService] })
export class EventSocketComponent extends SocketComponent {}
```

As seen above, we register the `UserService` as a service. This does exactly what the `@Component` decorator does for regular components; it makes the services in the `services` array accessible to all the socket services in the `socketServices` array.

Now, let's update our `EventsSocketService` class so we can interact with the `UserService` class:

```typescript
export class EventsSocketService extends DolphSocketServiceHandler<Dolph> {
  constructor() {
    super();
    this.socketService;
    this.handleEvents();
  }

  private UserService: UserService;

  private handleEvents() {
    this.socket.on("connection", (socket) => {
      socket.emit("connected", "connection successful");

      socket.on("new-user", (name: string) => {
        this.UserService.addUser({ name, clientId: socket.id });
        socket.emit("user-added", "user has been added");
      });

      socket.on("get-user", () => {
        const user = this.UserService.getUser(socket.id);
        socket.emit("user", user);
      });
    });
  }
}
```

On emitting a `new-user` event from our client, we get a user-added event sent with the message **user has been added**. If we call the `get-user` event, the user is retrieved.

> info **Tip** Every service class registered in the `@Socket` decorator get's attached to all the socket service classes registered in the decorator.