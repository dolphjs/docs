### Introduction

Dolph.js is a Node.js framework built on the express framework aimed at maintaining simplicity and efficiency for development of server-side applications, while enforcing clean-code architecture. Built with [TypeScript](http://www.typescriptlang.org/) and offers full support for both Typescript and Javascript while combining OOP (Object Oriented Programming) and FP (Functional Programming).

Dolph tries it's best to maintain compatibility with libraries and packages that work with [express](https://expressjs.com/en/) and also has a lot of similarities with the framework, hence making it's learning curve very easily for developers with prior knowledge of **express**.

#### Architectural Foundations

Server-side developement using Node.js has been made easier in recent years with the advent of popular frameworks like [Fastify](https://fastify.dev/), [Express](https://expressjs.com/en/) and [Nest](https://nestjs.com/), dolphjs tries to solve the issue of **Architecture** but still retaining simplicity and efficiency. Inspired by `Nest` and `Express` and built on the `Express` framework. Currently, dolphjs is still in it's beta stage and has so many cool features to present in the nearest future.

#### Prerequisites

- [Node.js](https://nodejs.org) (version >= 18)
- [Dolph CLI](/cli/overview) (version >= 1.2.0)

#### Installation

To setup a new project, the [Dolph CLI](/cli/overview) would be used. We'll install the CLI below and  create a new project with it:

```bash
$ npm install -g @dolphjs/cli
$ dolph new <project name>
```

> info **Hint** To create a new project in your current directory, use a `.` in place of `project name`.

The `project name` directory would be created alongside some confiuration files and sub-folders.