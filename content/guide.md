### Guide

In this section, we'll explore the **core fundamentals** of Dolph. To illustrate the essential building blocks of the framework, we'll walk through creating a basic **CRUD** application, showcasing the key features of Dolph at an introductory level.

#### Language

[Typescript](https://www.typescriptlang.org/) is the default and recommended language for Dolph projects.  However, Dolph is also compatible with pure JavaScript using the `express` style and can run on  [Node.js](https://nodejs.org/en/).

While most of our examples and sample code will be written in TypeScript, adhering to TypeScript conventions, you can easily switch the code snippets to vanilla JavaScript. Simply click the language toggle button in the upper right-hand corner of each snippet.

#### Prerequisites

- [Node.js](https://nodejs.org) (version >= 18)
- [Dolph CLI](/cli/overview) (version >= 1.2.4)

#### Setup

To set up a new project, you will use the **Dolph CLI**. Below, we’ll install the CLI and create a new project with it:

```bash
$ npm install -g @dolphjs/cli
$ dolph new <project name>
```

> info **Hint** To create a new project in your current directory, use a `.` in place of `project name`.

The `project name` directory will be created, along with some configuration files and subfolders.We'll assume you choose the default and recommended dolph structure [spring](/spring/overview)

<div class="file-tree">
 <div class="item">src</div>
  <div class="children">
    <div class="item">components</div>
    <div class="item">shared</div>
    <div class="item">server.ts</div>
  </div>
   <div class="item">tests</div>
    <div class="children">
    <div class="item">unit</div>
    <div class="item">integration</div>
  </div>
    <div class="item">.gitignore</div>
    <div class="item">.swcrc</div>
    <div class="item">dolph_cli.yaml</div>
    <div class="item">dolph_config.yaml</div>
    <div class="item">package.json</div>
    <div class="item">tsconfig.json</div>
</div>

A summary on the generated files and directories:

|                          |                                                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `.gitignore`      | The git ignore file used to specify files & folders git should ignore when pushing to remote repo.                                                                           |
| `.swcrc` | Config file for the swcrc package used by dolph.                            |
| `dolph_cli.yaml`          | The dolph CLI config file.                                                                                 |
| `dolph_config.yaml`         | The dolphjs config file.                                                                               |
| `package.json`                | Config file which holds info about the application. |
| `tsconfig.json`                | Typescript config file. |
| `src`                | Holds code written by developer. |
| `tests`                | Holds tests for codes. |
| `src/components`                | Contains all the individual components of the project. |
| `src/shared`                | Files that would be shared amongst components are placed here. |
| `tests/unit`                | Unit tests are written here. |
| `tests/integration`                | Integration tests are written here. |
| `sever.ts`                | The entry file of the application which uses the core function DolphFactory to create a Dolph application instance.. |

The `server.ts` registers components and services as well as starts the **Dolph core engine**:

```typescript
import { DolphFactory } from "@dolphjs/dolph";

const dolph = new DolphFactory([]);
dolph.start();
@@switch
const { DolphFactory } = require("@dolphjs/dolph");

const dolph = new DolphFactory([]);
dolph.start();
```

To create a new Dolph application instance, instantiate the `DolphFactory` class. This class provides several methods for configuration and other functionalities. Calling the start method will initialize the `Dolph core engine`.

#### Architectures

We strive to be as inclusive as possible, which is why Dolph projects support two architectures:  [spring](/architectures/spring) and [express](/architectures/express). This flexibility allows developers to choose based on their preferences.

>info **Note** The Spring architecture is the recommended approach for building DolphJS applications. It offers numerous utilities, functions, and features designed to accelerate development and enhance the overall experience.

Dolph is built on the [express](https://expressjs.com/) framework.

#### Running the application

The `dolph new <project name>` command sets up your project with the chosen architecture and configuration files. To run the application, you need to install the necessary packages. Navigate to the project directory and execute:

```bash
yarn install
```

After installing the packages, you may want to generate sample files. You can do this using the following command:

```bash
dolph generate -a <component name>
```

The command above generates a component with the following files: controller, service, model, and registers the controller class within the component class.

> info **Hint** In the current version, you need to manually import the component into the server file. The example below assumes you ran `dolph generate -a auth`:


```typescript
import { DolphFactory } from "@dolphjs/dolph";
import { AuthComponent } from "./components/auth/auth.component";

const dolph = new DolphFactory([AuthComponent]);
dolph.start();
```

You can now run `dolph start` to launch the application on the default port, or use `dolph watch` to run it in [watch mode](/cli/overview). After starting the server, open your browser and navigate to localhost:3030/auth/greet to receive a message from the server.
