### Cors

Cross-Origin Resource Sharing (CORS) is a mechanism that allows resources (e.g., APIs) on a web server to be requested from another domain outside the domain from which the resource originated. It is a critical security feature implemented by web browsers to prevent unauthorized access to resources.

When a web application makes a request to a different domain than the one serving the application, the browser sends an HTTP request with an Origin header indicating the origin of the requesting domain. The server then decides whether to allow the request based on the Origin header. You can read more on CORS [here][https://expressjs.com/en/resources/middleware/cors.html].

#### Implementation 

CORS can be implemented two ways in Dolph, the first is the recommended and mostly used but both works!

1. Using the `dolph_config.yaml` file:

```json
cors:
    activate: true
    origin: www.example.com
    methods:
      - GET
      - POST
      - PUT
      - DELETE
    allowedHeaders:
      - Content-Type
      - Authorization
    credentials: true
port: 3030
jsonLimit: 20mb
```

The above **dolph_config** file let's dolph know that *cors* should be enabled with the options passed under it.

2. Calling the `enableCors` method:

```typescript
const dolph = new DolphFactory([AppComponent], {
  options: { cors: { origin: '*' } },
  socketService: SocketService,
  component: new EventsComponent(),
});

dolph.enableCors({allowedHeaders: 'Content-Type', credentials: true})

dolph.start();
```

From the above code, we tell the dolphjs engine to enable the CORS middleware with the available route.