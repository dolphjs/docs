### Overview

The [Dolph CLI](https://github.com/dolphjs/cli) is a command-line interface tool designed to initialize, generate entities, and manage a Dolph project during development. It supports project scaffolding, serving in both development and production modes, and building the application for production. The CLI also helps maintain the architectural design and approach prescribed by Dolph.


#### Installation

**Note**: The Dolph CLI has three peer dependencies which should be installed alongside it, `@swc/core`, `@swc/cli` and `ts-node` . 

```typescript
$ npm install -g @dolphjs/cli @swc/core @swc/cli ts-node
```


### Basic Workflow

After installation, you can verify the process was successful by running the **--help** command. This command should return a list of available commands and their descriptions.

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

The next step is to run the command to **generate** a component:

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

You will now see logs indicating that your server has started running. You can open your browser and navigate to `http://localhost:3300/user` to receive a message from the server.


#### Options

When you run the `$ dolph new <project-name>` command, you will be prompted with a series of questions. Your answers to these questions will determine your project's configuration, which is then saved in the `dolph_cli.yaml` file located in the root directory.

> info **Note**  The `dolph_cli.yaml` file is readonly, so it should not be manually edited.

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
