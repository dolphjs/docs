### Usage

#### dolph new

Creates a new Dolph project.

```typescript
$ dolph new <project-name>
$ dolph nw <project-name>
```

##### Description

Creates and initializes a new Dolph project:

- Creates a folder with the specified `<project-name>`.
- Prompts for configuration inputs.
- Populates the project folder with necessary configuration files.
- Creates sub-folders for source code (`/src`), tests (`/tests`), and other related structures.


##### Configuration questions

* Select your preferred language: (ts / js)
* Choose the programming paradigm for your app (recommended is 'oop' ): (oop / functional)
* Which database will you be using? (mongo / mysql / postgresql / other)
* Which dolph routing architecture would you be using? (choosing 'spring' means that
 you are making use of  both 'oop' & 'typescript'): ([express](/routing/express) / [spring](/routing/spring))


#### dolph generate

Generates and/or modifies files based on a schematic.

```typescript
$ dolph generate <schematic> <name>
$ dolph g <schematic> <name>
```

##### Arguments

| Arguments | Description |
| ---------- | ---------------------------------------------------------------------------------------------- |
| `<schematic>`      |  The schematic to generate. See the table below for the available schematics.          |
| `<name>` | The name of the generated entity.                                  |


| Name    | Alias | Description                                                                                    |
| ---------- | ----- | ---------------------------------------------------------------------------------------------- |
| `controller`      | `-c`   | Creates a new controller class and file.          |
| `service` | `-s`   | Creates a new service class and file.                                          |
| `model`    | `-m`  | Creates a new model.                                    |
| `component`    |  `-com`  | Creates a new component class and file.                          |
| `route`    |  `-r`  | Creates a new route class and file.                          |
| `all`    |  `-a`  | Creates a complete component for the named entity and registers the classes where they belong.                          |


#### dolph build

Compiles a Typescript written codebase to Javascript and outputs it to the output directory (`/app`). 

```typescript
$ dolph build
```

#### dolph start

Compiles a TypeScript codebase to JavaScript, outputs it to the designated output directory (`/app`), and then starts the server. Alternatively, it can start a JavaScript server directly if already compiled.

```bash
$ dolph start
```

To start dolph.js with bun:

```bash
$ dolph start --bun
```


#### dolph watch

Starts the dolph project in watch mode.

```bash
$ dolph watch

```

To start dolph.js in watch mode with bun:

```bash
$ dolph watch --bun

```
