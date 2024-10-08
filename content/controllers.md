### Controllers

Controllers handle requests by processing them and returning appropriate responses.

Routing directs requests and groups of requests to specific controllers capable of managing them.

In Dolph, each controller extends the `DolphControllerHandler` class and accepts a generic type of `Dolph`, as shown below:

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

Dolph uses the `Route()` decorator for routing. This decorator takes a string parameter that serves as a prefix for routes, allowing you to group related routes together. For instance, if you want to group routes related to user functionality, you would pass `user` to the decorator, as shown below:

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

In the example above, to call the greet method and process a request, you would use the path `/user/greet`.

> info **Hint** The **Route()** decorator is necessary for your request handler method to be accessible. It’s recommended to create a controller via the CLI using the `$ dolph g -c <name>` command, as this automatically registers the controller class in the component class for you.

The `Get()` decorator is a HTTP request method decorator which marks the **greet** method handler as a [get request](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET). When the **Registrar** registers the controller into the dolph engine, a route mapping looking like this is created `GET /user/greet`.

Our **greet** method doesn't do much except to return a 200 success response with a message that says **you've reached the auth endpoint**.

The [SuccessResponse](/status/overview) is used to return a 200 status code with data which in this case is a message.

#### Route Parameters

This approach is useful when you need to accept dynamic data as part of a request via the route path (e.g., `GET /user/1` to retrieve the user with the dynamic data `1`). To achieve this, you can use route parameter placeholders, which are denoted by a colon in the route path. For example, the placeholder `:name` in the route `greet/:name` can be accessed using `req.params.name`.

```typescript
@Route('user')
export class AuthController extends DolphControllerHandler<Dolph> {
  constructor() {
    super();
  }

  @Get("greet/:name")
  async greet (req: DRequest, res: DResponse) {
    SuccessResponse({ res, body: { message: `Greetings to you ${req.params.name}` } });
  }
}

```

#### Request Object

Dolph is built on the [express](https://expressjs.com/en) framework hence giving access to the [request object](https://expressjs.com/en/api.html#req) provided by express. This is easily accessible through the `DRequest` interface exported by dolph.

> info **Hint** It is advisable to install the `@types/express` package to take advantage of `express` typings (as in the `req: DRequest` parameter of the **greet** method).

Several core objects can be accessed through the `request` object. Some of which include:

- **query** : This property is an object containing a property for each query string parameter in the route. When [query parser](https://expressjs.com/en/api.html#app.settings.table) is set to disabled, it is an empty object, otherwise it is the result of the configured query parser.

- **params** :  This property is an object containing properties mapped to the [named route](https://expressjs.com/en/guide/routing.html#route-parameters) “parameters”. For example, if you have the route **/user/:name**, then the “name” property is available as req.params.name. This object defaults to an empty object.

- **body** : Contains key-value pairs of data submitted in the request body.

- **payload** : Hold's data deserialized from the auth middleware.

- **cookies** : When using [cookie-parser](https://www.npmjs.com/package/cookie-parser) middleware, this property is an object that contains cookies sent by the request. If the request contains no cookies, it defaults to an empty object.

You can check out others [here](https://expressjs.com/en/api.html#req) to get full documentation.

#### Response Object

Dolph is built on the [express](https://expressjs.com/en) framework hence giving access to the [response object](https://expressjs.com/en/api.html#res) provided by express. This is easily accessible through the `DResponse` interface exported by dolph.

The Response Object is literally the HTTP response that is sent by the Dolph app when a request has been received and processed.

> info **Hint** It is advisable to install the `@types/express` package to take advantage of `express` typings (as in the `res: DResponse` parameter of the **greet** method).

Several core objects can be accessed through the `response` object. Some of which include:

- **cookie**: Set's a cookie data which is sent along with the response. Check full documentation [here](https://expressjs.com/en/api.html#res.cookie).

- **get**: Returns the HTTP response header specified by field. The match is case-insensitive. Check full documentation [here](https://expressjs.com/en/api.html#res.get).

- **json**: Sends a JSON response. This method sends a response (with the correct content-type) that is the parameter converted to a JSON string using **JSON.stringify()**.
The parameter can be any JSON type, including object, array, string, Boolean, number, or null, and you can also use it to convert other values to JSON. Check full documentation [here](https://expressjs.com/en/api.html#res.json).

- **redirect**: Redirects to the URL derived from the specified path, with specified status, a positive integer that corresponds to an [HTTP status code](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html) . If not specified, status defaults to “302 “Found”. Check full documentation [here](https://expressjs.com/en/api.html#res.redirect).

- **send**: Sends the HTTP response. The body parameter can be a Buffer object, a String, an object, Boolean, or an Array. Check documentation [here](https://expressjs.com/en/api.html#res.send).

- **status**: Sets the HTTP status for the response. It is a chainable alias of Node’s response.statusCode. Check full documentation [here](https://expressjs.com/en/api.html#res.status).

To get full documentation on the `request` object, check the official express documentation [here](https://expressjs.com/en/api.html#res.status).

#### Status Codes

All the HTTP status codes are documented [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status). When sending requests, using the already defined response senders by dolph, you may not need to pass the status codes manually. Below are such utiliy classes:

#### SuccessResponse (Response)

The `SuccessResponse` class is a utility designed to streamline the process of sending successful HTTP responses in your application. It provides a standardized structure for responses, including the status, body, and message.

<strong>Usage</strong>

1. Sending a success response with body and message: 

```typescript
SuccessResponse({
  res,
  status: 200,
  body: { data: 'example data' },
  msg: 'Request successful'
});

```

2. Sending a success response with only body:

```typescript
SuccessResponse({
  res,
  status: 200,
  body: { data: 'example data' },
});
```

3. Sending a success response with only message:

```typescript
SuccessResponse({
  res,
  status: 200,
  msg: 'Request successful'
});

```

4. Sending a success response with neither body nor message:

```typescript
SuccessResponse({
  res,
  status: 204,
});
```

> info **Hint** If the status field is not passed, the default status code is set to `200` as seen here:

```typescript
SuccessResponse({
  res,
  body: { data: 'example data' },
});
```

#### ErrorResponse (Response)

This works exactly like the `SuccessResponse` utility class with the exception that it defaults to **400** status code when the **status** field is omitted.

Example:

```typescript
ErrorResponse({
  res,
  msg: 'example error message',
})
```

#### ErrorException (Exception)

The ErrorException class extends the `DefaultException` class and is intended for representing custom error exceptions in your application. It provides a mechanism to create error instances with additional properties, such as status code, operational status, and stack trace.

<strong>Constructor Parameters</strong>

- **message**: string - A descriptive message for the error.

- **statusCode (optional)**: number - HTTP status code associated with the error.

- **isOperational (optional)**: boolean - Indicates whether the error is operational (default:  true). Operational errors are intended to be handled gracefully, while non-operational errors may indicate unexpected issues.

- **stack (optional)**: string - The stack trace for the error. If not provided, the constructor automatically captures the stack trace.

In a typical dolph application you'll see it called with only the `message` and `statusCode` parameters as seen below:

```typescript
throw new ErrorException('An error occurred', 500)
```

> info **Hint** Custom error instances can be created by instantiating the ErrorException class with relevant parameters. The stack trace is automatically captured unless provided explicitly.

#### BadGatewayException

This utility class extends the `DefaultException` class as the `ErrorException` does too,  but unlike the **ErrorException** class, in a typical dolph application, only the message param get's passed to this function because it defaults to a `502` status code as seen below:

```typescript
throw new BadGatewayException("this is a bad gateway exception")
```

#### BadRequestException

This utility class extends the `DefaultException` class as the `ErrorException` does too,  but unlike the **ErrorException** class, in a typical dolph application, only the message param get's passed to this function because it defaults to a `400` status code as seen below:

```typescript
throw new BadRequestException("this is a bad request exception")
```

#### ConflictException

This utility class extends the `DefaultException` class as the `ErrorException` does too,  but unlike the **ErrorException** class, in a typical dolph application, only the message param get's passed to this function because it defaults to a `409` status code as seen below:

```typescript
throw new ConflictException("this is a conflict exception")
```

#### ForbiddenException

This utility class extends the `DefaultException` class as the `ErrorException` does too,  but unlike the **ErrorException** class, in a typical dolph application, only the message param get's passed to this function because it defaults to a `403` status code as seen below:

```typescript
throw new ForbiddenException("this is a forbidden exception")
```

#### GoneException

This utility class extends the `DefaultException` class as the `ErrorException` does too,  but unlike the **ErrorException** class, in a typical dolph application, only the message param get's passed to this function because it defaults to a `410` status code as seen below:

```typescript
throw new GoneException("this is a gone exception")
```

#### HttpVersionUnSupportedException

This utility class extends the `DefaultException` class as the `ErrorException` does too,  but unlike the **ErrorException** class, in a typical dolph application, only the message param get's passed to this function because it defaults to a `410` status code as seen below:

```typescript
throw new HttpVersionUnSupportedException("this is a http version unsupported exception")
```

#### ImTeaPotException

This utility class extends the `DefaultException` class as the `ErrorException` does too,  but unlike the **ErrorException** class, in a typical dolph application, only the message param get's passed to this function because it defaults to a `418` status code as seen below:

```typescript
throw new ImTeaPotException("this is a I'm a teapot exception")
```

#### InternalServerErrorException

This utility class extends the `DefaultException` class as the `ErrorException` does too,  but unlike the **ErrorException** class, in a typical dolph application, only the message param get's passed to this function because it defaults to a `500` status code as seen below:

```typescript
throw new InternalServerErrorException("this is an internal server exception")
```

#### MethodNotAllowedException

This utility class extends the `DefaultException` class as the `ErrorException` does too,  but unlike the **ErrorException** class, in a typical dolph application, only the message param get's passed to this function because it defaults to a `405` status code as seen below:

```typescript
throw new MethodNotAllowedException("this is a method not allowed exception")
```

#### MisDirectedException

This utility class extends the `DefaultException` class as the `ErrorException` does too,  but unlike the **ErrorException** class, in a typical dolph application, only the message param get's passed to this function because it defaults to a `421` status code as seen below:

```typescript
throw new MisDirectedException("this is a misdirected exception")
```

#### NotAcceptableException

This utility class extends the `DefaultException` class as the `ErrorException` does too,  but unlike the **ErrorException** class, in a typical dolph application, only the message param get's passed to this function because it defaults to a `406` status code as seen below:

```typescript
throw new NotAcceptableException("this is a not-acceptable exception")
```

#### NotFoundException

This utility class extends the `DefaultException` class as the `ErrorException` does too,  but unlike the **ErrorException** class, in a typical dolph application, only the message param get's passed to this function because it defaults to a `404` status code as seen below:

```typescript
throw new NotFoundException("this is a not-found exception")
```

#### NotImplementedException

This utility class extends the `DefaultException` class as the `ErrorException` does too,  but unlike the **ErrorException** class, in a typical dolph application, only the message param get's passed to this function because it defaults to a `501` status code as seen below:

```typescript
throw new NotImplementedException("this is a not-implemented exception")
```


#### PaymentRequiredException

This utility class extends the `DefaultException` class as the `ErrorException` does too,  but unlike the **ErrorException** class, in a typical dolph application, only the message param get's passed to this function because it defaults to a `402` status code as seen below:

```typescript
throw new PaymentRequiredException("this is a payment required exception")
```

#### ServiceUnavaliableException

This utility class extends the `DefaultException` class as the `ErrorException` does too,  but unlike the **ErrorException** class, in a typical dolph application, only the message param get's passed to this function because it defaults to a `503` status code as seen below:

```typescript
throw new ServiceUnavaliableException("this is a service unavailable exception")
```

#### TimeOutException

This utility class extends the `DefaultException` class as the `ErrorException` does too,  but unlike the **ErrorException** class, in a typical dolph application, only the message param get's passed to this function because it defaults to a `504` status code as seen below:

```typescript
throw new TimeOutException("this is a timeout exception")
```

#### UnauthorizedException

This utility class extends the `DefaultException` class as the `ErrorException` does too,  but unlike the **ErrorException** class, in a typical dolph application, only the message param get's passed to this function because it defaults to a `401` status code as seen below:

```typescript
throw new UnauthorizedException("this is an unauthorized exception")
```

#### UnSupportedMediaException

This utility class extends the `DefaultException` class as the `ErrorException` does too,  but unlike the **ErrorException** class, in a typical dolph application, only the message param get's passed to this function because it defaults to a `415` status code as seen below:

```typescript
throw new UnSupportedMediaException("this is an unsupported media exception")
```

> info **Hint** It's recommended to use exceptions over `ErrorResponse` when returing 4** and 5** status codes to maximize dolphjs error handling mechanisms.

### Asynchronicity

Due to the way Node.js works, most functions / methods are usually asynchronous in nature hence the 100% compatibility Dolph has with `async` functions.

> info **Hint** Learn more about `async / await` feature [here](https://kamilmysliwiec.com/typescript-2-1-introduction-async-await)

Every async function has to return a `Promise`. This means that you can return a deferred value that Dolph will be able to resolve by itself. Let's see an example of this:

```typescript
@Get()
async fetchAll(): Promise<any[]>{
  return [];
}
```