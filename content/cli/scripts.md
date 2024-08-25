### Dolph CLI 

#### Dolph binary

The `dolph` binary command is an OS level binary (i.e., runs from the command line). We recommend the build (`dolph  build`) and execution (`dolph start`) and (`dolph watch`) sub-commands via the `package.json` scripts provided automatically after running the `dolph new name` command.

#### Build

The build command works together with the `swc` and `ts-node` compilers. When you run the `dolph build` command, the `swc` compiler is used to compile your typescript code to javascript in the **/app** directory and when you run the `dolph watch` command, the `ts-node` compiler is used to execute your typescript codes.

See the [dolph build](/cli/usages#dolph-build) page for more information.

#### Generation

The `$ dolph generate` command creates new Dolph components within the project directory, as the name suggests.

#### Migration

While you are not required to make any changes, you may want to migrate to using the new CLI commands instead of using tools such as **tsc-watch** or **ts-node**. In this case, simply install the latest version of the `@dolph/cli`, both globally and locally:

```typescript
$ yarn global install @dolph/cli
$ cd  /some/project/root/directory
$ yarn add @dolph/cli -D
```

You can then replace the `scripts` defined in `package.json` with the following ones:

```typescript
"build": "dolph build",
"start": "dolph start",
"dev:start": "dolph watch",
```