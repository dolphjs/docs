### Configuration

In the context of application development, configuring your application is a crucial step. This process involves defining a set of configuration variables and functions that the application will utilize. The values assigned to these configuration entities may vary depending on the **environment** in which the application is currently executing.

Environment variables defined outside of Node.js are accessible within the application via the `process.env` global variable. Managing multiple environments by individually setting these environment variables can become cumbersome, particularly in development and testing stages where there's a frequent need to mock or modify these values.

To streamline this process in Node.js applications, it's customary to make use of `.env` files. These files contain key-value pairs, with each key denoting a specific environment setting. Thereby, adapting an application to different environments simply involves replacing the `.env` file with one that corresponds to the target environment.

Dolph does not provide a specific methodology for achieving this goal but does present an example of how to ensure your application has a validated and well-structured configuration file. This is accomplished through the use of [Joi](https://github.com/hapijs/joi), a tool for schema descriptions and data validation.

#### Instal Joi

```bash
$ yarn add joi 
```

> info **Note** `@hapi/joi` has been depreciated, this is the recommended package to use.

#### Setup

After installation, we create a new `index.ts` file in the `shared/configs` directory.

```typescript
import { ErrorException } from "@dolphjs/dolph/common";
import Joi from "joi";

const envSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .description("current app environment")
      .default("development"),
    MONGO_DEV_URI: Joi.string().description("mongodb connection string").required(),
    MONGO_PROD_URI: Joi.string().description("mongodb connection string").required(),
  })
  .unknown();

const { value: envVars, error } = envSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error)
  throw new ErrorException(`Configs Load Error: ${error.message}`, 500);

export const configs = {
  env: envVars.NODE_ENV,
  mongo: {
    connectionString: envVars.env === "production" ? envVars.MONGO_PROD_URI : envVars.MONGO_DEV_URI,
  },
}
```

From the above code, we are both validating our configuration variables and assigning the value based on the environment. All we need to do now, is to import the required variable anywhere in our code in order to use the value of that configuration variable.

A sample `.env` file for the above config would look like this:

```json
MONGO_DEV_URI=mongodb://localhost:27017/app-dev
MONGO_PROD_URI=mongodb://localhost:27017/app-prod
NODE_ENV=production
```

### Config File (dolph_config.yaml)

The dolph_config.yaml file is a central configuration file for the Dolph framework. It allows you to configure various aspects of the framework, including database connections, middleware settings, routing, and more. Below is a detailed explanation of each configuration option available in the file.

```yaml
database:
  mongo:
    url: sensitive
    options: {}
middlewares:
  cors:
    activate: true
    origin: ''
    methods:
      - GET
      - POST
      - PUT
      - DELETE
    allowedHeaders: []
routing:
  base: '/v1'
port: 3030
jsonLimit: 2mb
```

### Configuration Options

<strong>database</strong>

- **mongo** - Configuration for MongoDB
- **mongo.url** - The MongoDB connection URL. If set to *sensitive*, Dolph will look for the **MONGO_URL** environment variable. If the environment variable is not found, an error will be thrown.
- **mongo.options** - Additional MongoDB connection options (optional).

<strong>middlewares</strong>

- **cors** - Configuration for Cross-Origin Resource Sharing (CORS) middleware
- **cors.activate** - Boolean value to activate or deactivate CORS middleware. If set to *false*, CORS middleware will not be applied.
- **cors.origin** - Specifies the origin that is allowed to access the resources.
- **cors.methods** -  A list of HTTP methods that are allowed.
- **cors.allowedHeaders** - A list of headers that are allowed.
- other options applicable to the **cors** package can be added below.

<strong>routing</strong>

- **base** - A string value that adds a prefix to all routes. For example, if base is set to v1, all routes will be prefixed with `/v1`.

<strong>port</strong>

An integer value specifying the port number. For example, `3030`.

<strong>jsonLimit</strong>

The **jsonLimit** setting configures the maximum size of JSON payloads that the server will accept.


### Configuration Details

**MongoDB URL Handling:** If the url field in database.mongo is set to sensitive, Dolph will look for the MONGO_URL environment variable. If this variable is not found, Dolph will throw an error and halt execution. This is useful for keeping sensitive information out of configuration files.

**CORS Middleware:** The CORS middleware configuration allows you to specify origins, methods, and headers that are permitted. If middlewares.cors.activate is set to false, the CORS middleware will not be applied.

**Routing Base:** The routing.base configuration adds the value of the base field as a prefix to all routes in the application. This is useful for versioning your API or organizing your routes under a common path.

**Port:** The port configuration sets the port on which the Dolph application will listen for incoming requests. This should be an integer value.

**JSON Limit:** The jsonLimit configuration sets the maximum size of JSON payloads that the server will accept. This should be specified in a format like 20mb.

### Example Usage

```yaml
database:
  mongo:
    url: sensitive
    options:
  
middlewares:
  cors:
    activate: true
    origin: 'https://example.com'
    methods:
      - GET
      - POST
      - PUT
      - DELETE
    allowedHeaders:
      - 'Content-Type'
      - 'Authorization'
routing:
  base: '/api/v1'
port: 8080
jsonLimit: 50mb
```