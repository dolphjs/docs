### Usage

#### dolph new

Creates a new Dolph project.

```typescript
$ dolph new <project-name>
$ dolph nw <project-name>
```

##### Description

Creates and initalizes a new Dolph project.

- Creates a folder with the given `<project-name>`.
- Prompts for configuration questions.
- Populates the project folder with configuration files.
- Creates sub-folders for source code (`/src`), sub-folder for test (`/tests`) and sub-folders for each.

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

Compiles a Typescript written codebase to Javascript and outputs it to the output directory (`/app`) then starts the server or starts a Javascript server.

```typescript
$ dolph start
```

#### dolph watch

Starts the dolph project in watch mode.

```typescript
$ dolph watch
```

