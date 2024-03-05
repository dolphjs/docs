### Overview

The [Dolph CLI](https://github.com/dolphjs/cli) is a command-line interface tool used to initalize, generate entities and manage a Dolph project when in development. It's used for scaffolding the project, serving, both in development and production mode, and building the application for production. It also helps mainitain the architectural design and approach followed by Dolph.

#### Installation

**Note**: The Dolph CLI has two peer dependencies which should be installed alongside it, `@swc-core` and `@swc-cli`. 

```typescript
$ npm install -g @dolphjs/cli @swc-core @swc-cli
```

### Basic Workflow

After Installation, to ensure that the process was successful, you can run the **--help** command which is expected to return a list of commands and what they do.

```typescript
$ dolph --help
```

You can also get more details about an individual command like the `generate` command by calling **--help** on them as shown below:

```typescript
$ dolph generate --help
```

To create and run a new project in development mode, run the following commands:

```typescript
$ dolph new dolph-app
$ cd dolph-app
$ yarn install
$ yarn dev:start
```

You will now see logs which indicates that your server has been ran and you can go to your browser at `http://localhost:3300` to see.

