### Overview

The Helmet package is a collection of middleware functions designed to improve the security of web applications. It helps to set various HTTP headers to prevent common web vulnerabilities.

Configuring the helmet package is very easy:

`server.ts`

```typescript
import { DolphFactory, middlewareRegistry } from '@dolphjs/dolph/common';
import helmet from 'helmet';

middlewareRegistry.register(helmet({}));

const dolph = new DolphFactory();

dolph.start();
```

> info **Hint** all fields for the helmet configurations are optional.