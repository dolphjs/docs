### Model-View-Controller

DolphJs is built on **Express** so the same technique that is used for MVC pattern in **Express** is applied here too.

Let's take you through from the beginning:

```bash
$ dolph new <project name>
```

### EJS implementation

Read more about Embedded-Javascript-engine (EJS) [here](https://ejs.co/)

```bash
$ yarn add ejs
```

`server.ts`

```typescript
import helmet from 'helmet';
import { DolphFactory, MVCAdapter } from '../../core';
import { UserComponent } from './user.component';
import path from 'node:path';

MVCAdapter.setViewEngine('ejs');
MVCAdapter.setStaticAssets(path.join(__dirname, 'public'));
MVCAdapter.setViewsDir(path.join(__dirname, 'views'));

const dolph = new DolphFactory([UserComponent]);

dolph.start();
```

`components/user.component.ts`

```typescript
import { DolphControllerHandler } from '../../classes';
import {
  DRequest,
  DResponse,
  Dolph,
} from '../../common';
import {
  Get,
  Render,
} from '../../decorators';

@Route('user')
export class NewController extends DolphControllerHandler<Dolph> {
  constructor() {
    super();
  }

  @Get('home')
  @Render('home')
  getHomePage(req: DRequest, res: DResponse) {
    return { title: 'Home' };
  }
}
```

`views/partials/header.ejs`

```html
<header>
  <h1>My MVC App With EJS</h1>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
</header>
```

`views/home.ejs`

```html
<%- include('partials/header') %>
<h1> <%=title %> Page</h1>
<p>Welcome to the home page!</p>
```

Project Structure

<div class="file-tree">
 <div class="item">src</div>
  <div class="children">
    <div class="item">components</div>
    <div class="item">shared</div>
    <div class="item">server.ts</div>
  </div>
   <div class="item">views</div>
        <div class="children">
            <div class="item">partials</div>
        </div>
            <div class="children">
            <div class="item">header.ejs</div>
            </div>
        <div class="item">home.ejs</div>
   <div class="item">public</div>
</div>



### Pug implementation

Read more about pug [here](https://pugjs.org/api/express.html)

```bash

$ yarn add pug

```

`server.ts`

```typescript
import helmet from 'helmet';
import { DolphFactory, MVCAdapter } from '../../core';
import { UserComponent } from './user.component';
import path from 'node:path';

MVCAdapter.setViewEngine('pug');
MVCAdapter.setStaticAssets(path.join(__dirname, 'public'));
MVCAdapter.setViewsDir(path.join(__dirname, 'views'));

const dolph = new DolphFactory([UserComponent]);

dolph.start();
```

`components/user.component.ts`

```typescript
import { DolphControllerHandler } from '../../classes';
import {
  DRequest,
  DResponse,
  Dolph,
} from '../../common';
import {
  Get,
  Render,
} from '../../decorators';

@Route('user')
export class NewController extends DolphControllerHandler<Dolph> {
  constructor() {
    super();
  }

  @Get('home')
  @Render('home')
  getHomePage(req: DRequest, res: DResponse) {
    return { title: 'Home' };
  }
}
```

`views/partials/header.pug`

```html
header
  h1 My MVC App With Pug
  nav
    a(href="/") Home
    a(href="/about") About
```

`views/home.pug`

```html
doctype html
html(lang="en")
  head
    title Home
  body
    include partials/header
    h1 #{title} Page
    p Welcome to the home page!

```

Project Structure

<div class="file-tree">
 <div class="item">src</div>
  <div class="children">
    <div class="item">components</div>
    <div class="item">shared</div>
    <div class="item">server.ts</div>
  </div>
   <div class="item">views</div>
        <div class="children">
            <div class="item">partials</div>
        </div>
            <div class="children">
            <div class="item">header.pug</div>
            </div>
        <div class="item">home.pug</div>
   <div class="item">public</div>
</div>


### Handlebars implementation

Read more about handlebars [here](https://www.npmjs.com/package/express-handlebars)

```bash

$ yarn add express-handlebars

```

`server.ts`

```typescript
import helmet from 'helmet';
import { DolphFactory, MVCAdapter } from '../../core';
import { UserComponent } from './user.component';
import path from 'node:path';

MVCAdapter.setViewEngine('handlebars');
MVCAdapter.setStaticAssets(path.join(__dirname, 'public'));
MVCAdapter.setViewsDir(path.join(__dirname, 'views', 'layouts', 'main'));

const dolph = new DolphFactory([UserComponent]);

dolph.start();
```

`components/user.component.ts`

```typescript
import { DolphControllerHandler } from '../../classes';
import {
  DRequest,
  DResponse,
  Dolph,
} from '../../common';
import {
  Get,
  Render,
} from '../../decorators';

@Route('user')
export class NewController extends DolphControllerHandler<Dolph> {
  constructor() {
    super();
  }

  @Get('home')
  @Render('home')
  getHomePage(req: DRequest, res: DResponse) {
    return { title: 'Home' };
  }
}
```

`views/layouts/main.handlebars`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{\{title}}</title>
</head>
<body>
    {\{body}}
</body>
</html>
```

`views/home.handlebars`

```html
<h1>Home Page</h1>
<p>Welcome to the {'{ title}} page!</p>
```

Project Structure

<div class="file-tree">
 <div class="item">src</div>
  <div class="children">
    <div class="item">components</div>
    <div class="item">shared</div>
    <div class="item">server.ts</div>
  </div>
   <div class="item">views</div>
        <div class="children">
            <div class="item">layouts</div>
        </div>
            <div class="children">
            <div class="item">main.handlebars</div>
            </div>
        <div class="item">home.handlebars</div>
   <div class="item">public</div>
</div>