### Controllers

Controllers are request handlers. They process the request made to the server and return appropriate response.

With the help of routing, requests & group of requests are directed to individual controllers capable of handling such requests.

Each controller in Dolph extends the `DolphControllerHandler` class and accepts a generic of `Dolph` as seen below:

```typescript
@Route('auth')
export class AuthController extends DolphControllerHandler<Dolph> {
  constructor() {
    super();
  }

  @Get("greet")
  async greet (req: DRequest, res: DResponse) {
    SuccessResponse({ res, body: { message: "you've reached the auth endpoint." } });
  }
}
```

#### Routing

Dolph makes use of the `Route()` decorator for routing, this decorator accepts a param of string which acts as a param prefix for routes and hence used to group a set of routes. We may choose to group a set of routes that deal only with the **user** routes so we pass `user` to the decorator as seen below:

```typescript
@Route('user')
export class AuthController extends DolphControllerHandler<Dolph> {
  constructor() {
    super();
  }

  @Get("greet")
  async greet (req: DRequest, res: DResponse) {
    SuccessResponse({ res, body: { message: "you've reached the auth endpoint." } });
  }
}
```

From the above code, when we want to call the **greet** method to process request, we reach that method using the path `/user/greet`.

> info **Hint** The **Route()** decorator is required in order for your request handler method to be reached. Creating only a controller via the CLI is very easy and recommended because the controller class get's registerd in the component class automatically for you:  `$ dolph g -c <name>` command.

The `Get()` decorator is a HTTP request method decorator which marks the **greet** method handler as a [get request](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET). When the **Registrar** registers the controller into the dolph engine, a route mapping looking like this is created `GET /user/greet`.

Our **greet** method doesn't do much except to return a 200 success response with a message that says **you've reached the auth endpoint**.

The [SuccessResponse](/status/overview) is used to return a 200 status code with data which in this case is a message.

#### Request Object

Dolph is built on the [express](https://expressjs.com/en) framework hence giving access to the [request object](https://expressjs.com/en/api.html#req) provided by express. This is easily accessible through the `DRequest` interface exported by dolph.

> info **Hint** It is advisable to install the `@types/express` package to take advantage of `express` typings (as in the `req: DRequest` parameter of the **greet** method).

Several core objects can be accessed through the `request` object. Some of which include:

<!-- - **query** : This property is an object containing a property for each query string parameter in the route. When [query parser](https://expressjs.com/en/api.html#app.settings.table) is set to disabled, it is an empty object {}, otherwise it is the result of the configured query parser.

- **params** :  This property is an object containing properties mapped to the [named route](https://expressjs.com/en/guide/routing.html#route-parameters) “parameters”. For example, if you have the route **/user/:name**, then the “name” property is available as req.params.name. This object defaults to {}.

- **body** : Contains key-value pairs of data submitted in the request body.

- **payload** : Hold's data deserialized from the auth middleware.

- **cookies** : When using [cookie-parser](https://www.npmjs.com/package/cookie-parser) middleware, this property is an object that contains cookies sent by the request. If the request contains no cookies, it defaults to {}. -->

You can check out others [here](https://expressjs.com/en/api.html#req) to get full documentation.


You can check out others here
