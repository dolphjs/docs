### Guide

We'll discuss the **core fundamentals** of Dolph in this section. In order to take you through the essential building blocks of the framework, we'll build a basic CRUD application with the most common features of Dolph at the introduction level.

#### Language

[Typescript](https://www.typescriptlang.org/) is the default and recommended language for Dolph projects  but that doesn't stop us for making Dolph compatible with **pure Javascript** which runs on [Node.js](https://nodejs.org/en/).

Most of our examples and sample codes would be written with Typescript and with regards to the Typescript way of implementation, but you can always **switch the code snippets** to vanilla JavaScript syntax (simply click to toggle the language button in the upper right hand corner of each snippet).

#### Prerequisites

- [Node.js](https://nodejs.org) (version >= 18)
- [Dolph CLI](/cli/overview) (version >= 1.2.0)

#### Setup

To setup a new project, the [Dolph CLI](/cli/overview) would be used. We'll install the CLI below and  create a new project with it:

```bash
$ npm install -g @dolphjs/cli
$ dolph new <project name>
```

> info **Hint** To create a new project in your current directory, use a `.` in place of `project name`.

The `project name` directory would be created alongside some confiuration files and sub-folders. We'll assume you choosed the default dolph architecture [spring](/spring/overview)

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
| `tsconfig.json`                | Typescript cnfig file. |
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

To create a new Dolph application instance, we instantiate the `DolphFactory` class. This class exposes a couple of methods that allow for configuration and other functionalities. The `start` method when called starts the `Dolph core engine`. 

#### Architectures

We try our best to be inclusive as possible hence the reason we have more than one architecture for Dolph projects: [spring](/architectures/spring) and [express](/architectures/express). The allow developers to write code based on thier preferences.

>info **Note** Spring architecture is the recommended appraoch for building dolphjs applications because it has a lot of utilities, functions and features which could be used to speed up development time and give a better experience.

Dolph is built on the [express](https://expressjs.com/) framework.

#### Running the application

Running the `dolph new <project name>` command set's up your project with the choosen architecture and config files but to run an application, you have to install packages by naviagting to the project location and runnning:

```bash
yarn install
```

After installing packages, you would want to have sample files generated for you and this can be done using the below command:

```bash
dolph generate -a <component name>
```

The command above generates a component with the following files: controller, service, model and registers the controller class in the component class.

> info **Hint** As at the currently version, you need to import the component manually into the server file as shown below (the below example assumes you ran `dolph generate -a auth`):

```typescript
import { DolphFactory } from "@dolphjs/dolph";
import { AuthComponent } from "./components/auth/auth.component";

const dolph = new DolphFactory([AuthComponent]);
dolph.start();
```

Now you can run `dolph start` to run the application on the default port or `dolph watch` to run in [watch mode](/cli/overview). After starting the server, navigate to your browser on `localhost:3030/auth/greet` to get a message from the server.