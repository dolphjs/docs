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
```

The next command you'll run has to be the command to **generate** a component:

```typescript
$ dolph generate -a user
```

The above command creates a new component for the **user** entity. You can notice the files and classes created and connected by default for you by the CLI. Now, all you have to do is to register the `UserComponent` class in the `DolphFactory` as seen below:

```typescript
@@filename(server)
import { DolphFactory } from "@dolphjs/dolph";
import { UserComponent } from "./components/user/user.component";

const dolph = new DolphFactory([UserComponent]);
dolph.start();
```

and now you can run the command:

```typescript
$ yarn dev:start
```

You will now see logs which indicates that your server has started running and you can go to your browser at `http://localhost:3300/user` to get a message from the server.


#### Options

When you run the `$ dolph new <project-name>` command, you are prompted with a couple of questions and your choice of answer for each question determines your project configuration. These configurationa are saved in the `dolph_cli.yaml` file which you see present in your root directory. 

> info **Note** The `dolph_cli.yaml` file is **readonly** and you shouldn't attempt to update it manually.


#### Command Syntax

All `dolph` commands follow the same format:

```typescript
dolph commandOrAlias requiredArg 
```

For example:

```typescript
$ dolph new my-app
```

Here, `new` is the *commandOrAlias*. The `new` command has an alias of `nw`. `my-app` is the  *requiredArg*. 


#### Command overview

Run `dolph <command> --help` for any of the following commands to see command-specific options. 
See [usage](/cli/usages) for detailed descriptions for each command.


| Command    | Alias | Description                                                                                    |
| ---------- | ----- | ---------------------------------------------------------------------------------------------- |
| `new`      | `nw`   | Scaffolds a new project with all core files and project structure.          |
| `generate` | `g`   | Generates and/or modifies files based on a schematic.                                          |
| `build`    |       | Compiles an application or workspace into the `app` directory which serves as the output folder.                                    |
| `start`    |       | Compiles and runs an application.                          |
| `watch`    |       | Compiles and runs an application in watch mode.                          |
| `config`    |  `cf`  | Updates the `dolph_cli.yaml` file.                          |
