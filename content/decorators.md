### Decorators

Dolph makes use of a lot of [decorators](https://www.typescriptlang.org/docs/handbook/decorators.html#handbook-content) to implement a wide range of features. We have already come across some of these decorators in previous sections, some of them include: **Component**, **InjectMongo**, **InjectMysql**, **Route**, **Get**, to name but a few.

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
    </tbody>
</table>