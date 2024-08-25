### Introduction

Dolph.js is a Node.js framework built on top of the Express framework, designed to maintain simplicity and efficiency in developing server-side applications while enforcing clean-code architecture. Developed with [TypeScript](http://www.typescriptlang.org/), Dolph.js offers full support for both TypeScript and JavaScript, combining Object-Oriented Programming (OOP) and Functional Programming (FP) paradigms.

Dolph.js strives to maintain compatibility with libraries and packages that work with [Express](https://expressjs.com/en/) and shares many similarities with it. As a result, developers with prior experience in **Express** will find the learning curve for Dolph.js very approachable.


#### Architectural Foundations

Server-side development using Node.js has become easier in recent years with the rise of popular frameworks like [Fastify](https://fastify.dev/), [Express](https://expressjs.com/en/) and [Nest](https://nestjs.com/). Dolph.js aims to address architectural challenges while retaining simplicity and efficiency. It is inspired by **Nest** and **Express** and is built on top of the **Express** framework. Currently, Dolph.js is in its beta stage, with many exciting features planned for the near future.

#### Prerequisites

- [Node.js](https://nodejs.org) (version >= 18)
- [Dolph CLI](/cli/overview) (version >= 1.2.4)

#### Installation

To set up a new project, use the [Dolph CLI](/cli/overview). Below, we’ll install the CLI and create a new project with it:

```bash
$ npm install -g @dolphjs/cli
$ dolph new <project name>
```

> info **Hint** To create a new project in your current directory, use a `.` in place of `project name`.

The `project name` directory will be created, along with some configuration files and subfolders.