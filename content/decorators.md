### Decorators

Dolph makes use of many [decorators](https://www.typescriptlang.org/docs/handbook/decorators.html#handbook-content) to implement a wide range of features. We have already come across some of these decorators in previous sections, some of them include: **Component**, **InjectMongo**, **InjectMysql**, **Route**, **Get**, to name but a few.

<blockquote class="external">
An ES2016 decorator is an expression which returns a function and can take a target, name and property descriptor as arguments. You apply it by prefixing the decorator with an @ character and placing this at the very top of what you are trying to decorate. Decorators can be defined for either a class, a method or a property. 
</blockquote>

#### Class Decorators

These are decorators that directly affect the class. A class decorator is usually declared on the class. A list of all the current class decorators Dolph offers are listed below:

<table>
  <tbody>
    <tr>
      <td><code>@InjectMongo()</code></td>
      <td><code>Injects a mongo model into service class.</code></td>
    </tr>
    <tr>
      <td><code>@InjectMySQL()</code></td>
      <td><code>Injects a mySQL model into service class.</code></td>
    </tr>
    <tr>
      <td><code>@InjectServiceHandler()</code></td>
      <td><code>Injects an array of service classes into another class.</code></td>
    </tr>
    <tr>
      <td><code>@Route(path?:string)</code></td>
      <td><code>Used to mark a controller class. It accepts the route path as a param.</code></td>
    </tr>
    <tr>
      <td><code>@Shield(middlewares: Middleware | Middleware[])</code></td>
      <td><code>Used for registering auth shields.</code></td>
    </tr>
    <tr>
      <td><code>@Component(params: ComponentParams)</code></td>
      <td><code>A class that registers controllers belonging to an entity.</code></td>
    </tr>
  </tbody>
</table>

#### Method Decorators

The decorators directly affect the class-method they are declared on. In Dolph, one method could have more than **1** decorator attached to them so it's essential to try maintaining order else your code may not work as supposed.
Below is a list of these decorators:

<table>
    <tbody>
        <tr>
            <td><code>@UseMiddlware(middleware: Middleware)</code></td>
            <td><code>Registers a middleware for a method.</code></td>
        </tr>
        <tr>
            <td><code>@CookieAuthVerifyDec(secret: string)</code></td>
            <td><code>Used for verifying auth cookies.</code></td>
        </tr>
        <tr>
            <td><code>@Get(path?: string)</code></td>
            <td><code>Route decorator for declaring a method as a `GET` request handler.</code></td>
        </tr>
        <tr>
            <td><code>@Post(path?: string)</code></td>
            <td><code>Route decorator for declaring a method as a `POST` request handler.</code></td>
        </tr>
        <tr>
            <td><code>@Patch(path?: string)</code></td>
            <td><code>Route decorator for declaring a method as a `PATCH` request handler.</code></td>
        </tr>
        <tr>
            <td><code>@Put(path?: string)</code></td>
            <td><code>Route decorator for declaring a method as a `PUT` request handler.</code></td>
        </tr>
        <tr>
            <td><code>@Delete(path?: string)</code></td>
            <td><code>Route decorator for declaring a method as a `DELETE` request handler.</code></td>
        </tr>
        <tr>
            <td><code>@JWTAuthVerifyDec(secret: string)</code></td>
            <td><code>Used for verification of auth tokens. Acts like a middleware.</code></td>
        </tr>
        <tr>
            <td><code>@JWTAuthorizeDec(secret: string)</code></td>
            <td><code>Used for authorization. Acts like a middleware.</code></td>
        </tr>
        <tr>
            <td><code>@MediaParser(options: IMediaParserOptions)</code></td>
            <td><code>Utility decorator for processing files. Uses the multer library under the hood.</code></td>
        </tr>
         <tr>
            <td><code>@TryCatchDec()</code></td>
            <td><code>Designed to be used with methods in a class, particularly those handling HTTP requests or asynchronous operations. It wraps the original method, catching any synchronous or asynchronous errors that might occur during its execution. This helps in handling errors gracefully and forwarding them to the next middleware or error-handling mechanism.</code></td>
        </tr>
        <tr>
            <td><code>@TryCatchAsyncDec()</code></td>
            <td><code>Designed to be used with asynchronous methods in a class, particularly those handling asynchronous operations or promises. It wraps the original asynchronous method, catching any errors that might occur during its execution. This helps in handling errors gracefully and forwarding them to the next middleware or error-handling mechanism.</code></td>
        </tr>
    </tbody>
</table>

As you can see above, there are many decorators you are just seeing for the first time and we'll use the sections below to discuss about them with appropriate examples.

#### InjectServiceHandler

The **InjectServiceHandler** function is a decorator factory designed to inject service handlers into a class instance. It takes an array of `DolphServiceMapping` objects, each defining a service name and its corresponding handler class. The injected service handlers become accessible as properties of the decorated class instance.

The **InjectServiceHandler** function is a decorator factory that returns a class extending the provided base class. During the instantiation of the extended class, it creates instances of the specified service handlers and injects them as properties with the specified service names.

> info **Hint** Ensure that the provided service mappings match the property names of the decorated class where the service handlers will be injected.

##### Usage

We'll be showing a scenario where this could be used. It is mainly used in the [express routing(/routing) architecture but can still be used in `spring routing` in the case of numerous services in one coponent.

Let's say we update our project with a service called `msg`:

```typescript
@@filename(msg.service)
import { DolphServiceHandler } from "@dolphjs/dolph/classes";
import { Dolph } from "@dolphjs/dolph/common";
import { Msg } from "./msg.interface";

export class MsgService extends DolphServiceHandler<Dolph>{
    constructor(){
        super("msgservice")
    }

    private msgs: Msg[] = [];

    new(msg: Msg){
        return this.msgs.push(msg);
    }
}
```

We create an `Index.service` file which would act as an index service:

```typescript
@@filename(index.service)
import { InjectServiceHandler } from "@dolphjs/dolph/decorators";
import { UserService } from "./user.service";
import { MsgService } from "./msg.service";

@InjectServiceHandler([
    {serviceName: "userservice", serviceHandler: UserService},
    {serviceName: "msgservice", serviceHandler: MsgService},
])
export class IndexService{
    userservice: UserService;
    msgservice: MsgService; 
}
```

From the code above, we see that the services are injected into the **IndexService** class using the decorator and now we can update our controller as seen below:

```typescript
import { DolphControllerHandler } from "@dolphjs/dolph/classes";
import {
  Dolph,
  SuccessResponse,
  DRequest,
  DResponse,
  NotFoundException
} from "@dolphjs/dolph/common";
import { Get, Post, Route } from "@dolphjs/dolph/decorators";
import { IndexService } from "./index.service";

const service =  new IndexService();

@Route('user')
export class UserController extends DolphControllerHandler<Dolph> {

  @Post("new")
  async newUser(req: DRequest, res: DResponse): Promise<void>{
    service.userservice.create(req.body);
    SuccessResponse({res, body: {message: "user created successfully"}});
  }

  @Get(":name")
  async getUser(req: DRequest, res:DResponse): Promise<void>{
    const result = service.userservice.fetchOne(req.params.name);
    if(!result) throw new NotFoundException("user not found");
    SuccessResponse({res, body: result});
  }
}
```

> info **Hint** This is only recommended when you have more than **one** service class within your component and yet still, it's meant to be used with `express routing` architecture.

#### UseMiddlware

The **UseMiddleware** decorator is designed to be used with class methods, particularly those handling HTTP requests or middleware execution. It allows you to attach one or more middleware functions to a specific method, enhancing the functionality of the method with additional processing logic.

> info **Hint** Multiple middleware functions can be attached to a single method, and their execution order follows the order of attachment.

Let's create a `dummy` middleware function to show how this works:

```typescript
@@filename(dummy.middleware)
import { BadRequestException, DNextFunc, DRequest, DResponse } from "@dolphjs/dolph/common";

export const dummyMiddleware = (req: DRequest, _res: DResponse, next: DNextFunc) => {
    if(!req.body.name) throw new BadRequestException("please provide name in request body");
    next();
}
```

Then let's update our controller:

```typescript
  @Post("new")
  @UseMiddlware(dummyMiddleware)
  async newUser(req: DRequest, res: DResponse): Promise<void>{
    service.create(req.body);
    SuccessResponse({res, body: {message: "user created successfully"}});
  }
```

Now, try sending a request without the `name` field and you'll receive a `BadRequestException` with the message *please provide name in request body*.

#### MediaParser

The **MediaParser** function is designed to be used as a method decorator for Dolph controllers. It facilitates the parsing and handling of media files in the request body, supporting both single and array file uploads. The function integrates with the [Multer]\(https://www.npmjs.com/package/multer/) middleware for file upload processing and provides error handling for unsupported file types.


The `IMediaParserOptions` interface:

```typescript
interface IMediaParserOptions {
  fieldname: string;
  type: 'single' | 'array';
  extensions?: string[];
  limit?: number;
  storage?: Multer.StorageEngine;
}
```

- **fieldname** - The name of the field in the form containing the media file(s).

- **type** - Indicates whether the parser should handle a single file or an array of files.

- **extensions** - An array of allowed file extensions. Defaults to a set of common image file extensions.

- **limit**  - The maximum number of files to be uploaded (applicable for type 'array'). `Defaults to 10`.

- **storage** - Custom storage engine configuration for **Multer**.

The **@MediaParser** decorator works as a method decorator, wrapping the original method with additional logic for handling media files. It checks the request's content type, validates file extensions, and uses Multer middleware for file upload processing.

##### Usage

Let's implement this with our **newUser** method so that we can upload files:

```typescript
@@filename(user.controller)
  @Post("new")
  @MediaParser({fieldname: 'upload', type: 'single'})
  @UseMiddlware(dummyMiddleware)
  async newUser(req: DRequest, res: DResponse): Promise<void>{
    service.create(req.body);
    SuccessResponse({res, body: {message: "user created successfully", file: req.file}});
  }
```

> info **Note** We only provided value for the required params and let the optional params empty but you can always update yours based on needs. When sending the file, the name assigned is the value of **fieldname** which in our case is `upload`. Also, remember to order your decorators well to avoid errors.


#### TryCatchDec and TryCatchAsyncDec

The **TryCatchAsyncDec** decorator is designed to be used with asynchronous methods in a class. It wraps the original asynchronous method, catching any errors that might occur during its execution. This helps in handling errors gracefully and forwarding them to the next middleware or Dolph's error-handling mechanism.

The **TryCatchAsyncDec** decorator works by replacing the original asynchronous method with a new asynchronous function that wraps it in a try-catch block. If an error occurs during the execution of the original method, the error is caught, and the next function is called to pass the error to the next middleware or Dolph's error-handling mechanism.

The **TryCatchDec** is just a **TryCatchAsyncDec** that works for synchronous code and not asynchronous as the later does.

##### Usage

```typescript
@@filename(user.controller)
 @Post("new")
  @TryCatchDec
  @MediaParser({fieldname: 'upload', type: 'single'})
  @UseMiddlware(dummyMiddleware)
  async newUser(req: DRequest, res: DResponse): Promise<void>{
    service.create(req.body);
    SuccessResponse({res, body: {message: "user created successfully", file: req.file}});
  }
```

This means that youb don't need to explicitly write the `try-catch` block yourself but can add it to your method by just calling the decorator.

> info **Hint** These decorators are **top-level** decorators and should be placed above all other decorators except the route decorators.


This marks the end of this section. Every other decorator not discussed here would be in other sections mainly because they are broader and reply heavily on availability of other functions.