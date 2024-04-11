### Configuration

In the context of application development, configuring your application is a crucial step. This process involves defining a set of configuration variables and functions that the application will utilize. The values assigned to these configuration entities may vary depending on the **environment** in which the application is currently executing.

Environment variables defined outside of Node.js are accessible within the application via the `process.env` global variable. Managing multiple environments by individually setting these environment variables can become cumbersome, particularly in development and testing stages where there's a frequent need to mock or modify these values.

To streamline this process in Node.js applications, it's customary to make use of `.env` files. These files contain key-value pairs, with each key denoting a specific environment setting. Thereby, adapting an application to different environments simply involves replacing the `.env` file with one that corresponds to the target environment.

Dolph does not provide a specific methodology for achieving this goal but does present an example of how to ensure your application has a validated and well-structured configuration file. This is accomplished through the use of [Joi](https://github.com/hapijs/joi), a tool for schema descriptions and data validation.

#### Instal Joi

```bash
$ yarn add joi 
```

> warning **Note** `@hapi/joi` has been depreciated, this is the recommended package to use.

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