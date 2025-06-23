### Framework Overview

DolphJS is a modern, developer-friendly Node.js and Bun framework that provides a comprehensive toolkit for building web applications and APIs. It combines the flexibility of Express.js with a structured, decorator-based architecture similar to Spring Boot or NestJS.

#### Key Features

- 🎯 **Decorator-based Architecture**: TypeScript decorators for controllers, services, middleware, and more
- 🔐 **Built-in Authentication**: JWT and Cookie-based authentication with decorators
- 🗄️ **Database Integration**: MongoDB (Mongoose) and MySQL/PostgreSQL (Sequelize) support
- 🔌 **Real-time Communication**: Socket.io integration for WebSocket connections
- 📁 **File Upload**: Built-in file upload handling with validation
- 🎨 **Template Engines**: EJS, Handlebars, and Pug support
- 🧩 **Dependency Injection**: Spring-like dependency injection system
- 🛡️ **Middleware Management**: Comprehensive middleware system with shields
- ⚡ **Cross-Runtime**: Runs on both Node.js and Bun
- 🔍 **Validation**: Built-in request validation using decorators

#### Philosophy

DolphJS follows several core principles:

1. **Developer Experience First**: Easy-to-use decorators and intuitive APIs
2. **Type Safety**: Built with TypeScript from the ground up
3. **Modular Architecture**: Component-based structure for better organization
4. **Express Compatibility**: Full compatibility with Express.js ecosystem
5. **Convention over Configuration**: Sensible defaults with customization options

#### Getting Started

The fastest way to get started with DolphJS is using the CLI:

```bash
$ npm install -g @dolphjs/cli
$ dolph new my-app
$ cd my-app
$ npm install
$ dolph generate -a user
$ npm run dev:start
```

This creates a new DolphJS application with a user component including controller, service, and model files.

#### Architecture Overview

DolphJS applications are organized around **Components** that contain related functionality:

```
src/
├── components/          # Business logic components
│   └── user/
│       ├── user.component.ts    # Component registration
│       ├── user.controller.ts   # HTTP request handlers
│       ├── user.service.ts      # Business logic
│       └── user.model.ts        # Data models
├── shared/              # Shared utilities and services
└── server.ts           # Application entry point
```

#### Core Concepts

- **DolphFactory**: Main application factory for bootstrapping
- **Components**: Organizational units that group related functionality
- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and data access
- **Decorators**: TypeScript decorators for configuration and behavior
- **Middleware**: Request/response processing pipeline
- **Guards/Shields**: Authentication and authorization layer

#### Comparison with Other Frameworks

| Feature | DolphJS | NestJS | Express | Fastify |
|---------|---------|--------|---------|---------|
| TypeScript First | ✅ | ✅ | ❌ | ❌ |
| Decorator Support | ✅ | ✅ | ❌ | ❌ |
| Express Compatible | ✅ | ✅ | ✅ | ❌ |
| Built-in DI | ✅ | ✅ | ❌ | ❌ |
| Learning Curve | Low | High | Low | Medium |
| Bundle Size | Small | Large | Small | Small |

#### When to Use DolphJS

**Perfect for:**
- Full-stack TypeScript applications
- APIs requiring strong typing
- Projects needing rapid development
- Teams familiar with Express.js
- Applications requiring real-time features

**Consider alternatives for:**
- Simple REST APIs without complex business logic
- Projects requiring minimal dependencies
- Performance-critical applications
- Teams preferring functional programming patterns

#### Community and Ecosystem

- **GitHub**: [https://github.com/dolphjs/dolph](https://github.com/dolphjs/dolph)
- **NPM**: [@dolphjs/dolph](https://www.npmjs.com/package/@dolphjs/dolph)
- **CLI**: [@dolphjs/cli](https://www.npmjs.com/package/@dolphjs/cli)
- **Examples**: [Sample Applications](https://github.com/dolphjs/samples)
- **Discord**: Join our community for support and discussions

#### Next Steps

- Read the [Introduction](/introduction) for detailed setup instructions
- Follow the [Guide](/guide) for a comprehensive walkthrough
- Explore [Examples](https://github.com/dolphjs/samples) to see DolphJS in action
- Check out [Advanced Techniques](/techniques/configuration) for production-ready features 