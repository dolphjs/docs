### Database

Dolph offers support for all databases that express support, allowing you to integrate SQL or NoSQL database. As per this current version of Dolph, we offer special out-of-the-box for [mongodb](https://www.mongodb.com/) and [mysql](https://www.mysql.org/) via the [mongoose](https://mongoosejs.com/docs/) and [sequelize](https://sequelize.org/) packages respectively. Connecting to your **Mongo** or **MySQL** db is as simple as writing one line of code. There are different alternatives which you can pick from.

#### MongoDB Integration

There are three out-of-the-box options provided by Dolph for MongoDB integration:

##### Via Dolph Config File

By Just adding this config fields in your `dolph_config.yaml` file, you tell Dolph to initialize your Mongo database for you without doing anything more: 

```yaml
port: 3300    
database:
  mongo:
    url: mongodb://127.0.0.1/27017/my_db
```
In a production environment where you want your Mongo URL to be a secret, you can pass **sensitive** in place of the url provided that you have a **MONGO_URL** variable in your `.env` file with the url as see below:

Your config file: 
```yaml
database:
  mongo:
    url: sensitive
```

Your env file:
```bash
MONGO_URL=mongodb://127.0.0.1/27017/my_db
```

##### Via AutoInitMongo

Using this method requires calling the `autoInitMongo` in your **server.ts** file with the `MongooseConfig` params as seen below:

```typescript
import { DolphFactory } from '@dolphjs/dolph';
import { autoInitMongo } from '@dolphjs/dolph/packages';
import { AppComponent } from './app.component';
import { routes } from './index.routes';

const dolph = new DolphFactory([AppComponent]);

autoInitMongo({url: "", options: {}})

dolph.start();
```

##### Via InitMongo

The **initMongo** is the function that is called by the `autoInitMongo` function behind the hood.This function is used when you want to handle the promise returned by mongoose connect function on your own:

```typescript
import { DolphFactory } from '.@dolphjs/dolph';
import { initMongo } from '@dolphjs/dolph/packages';
import { AppComponent } from './app.component';
import { routes } from './index.routes';

const dolph = new DolphFactory([AppComponent]);

initMongo({url: "", options: {}})
.then(_result => console.log("Database Connected"))
.catch(err => console.log(err) )

dolph.start();
```

#### MySql Integration

There is only one out-of -the-box option provided by Dolph for **MySql** integration:

##### Via AutoInitMySql

server.ts file:

```typescript
import { DolphFactory } from '@dolphjs/dolph';
import { AppComponent } from './app.component';
import { autoInitMySql } from '@dolphjs/dolph/packages';
import { routes } from './index.routes';
import { mysql } from '@/shared/config';

const dolph = new DolphFactory([AppComponent]);
autoInitMySql(mysql);

dolph.start();
```

mysql.config.ts file:

```typescript
import { initMySql } from '@dolphjs/dolph/packages';

const mysql = initMySql('dolph', 'root', 'password', 'localhost');

export { mysql };

```

Use in model (model.ts file):

```typescript
import { INTEGER, STRING } from 'sequelize';
import { mysql } from '@/shared/config';

const User = mysql.define('user', {
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: STRING,
    allowNull: false,
  },
  age: INTEGER,
});

export { User };
```

You can initialize these db's by yourself, you are not restricted to these options. You can also initialize other databases as you would do in **express**. In future versions, we'll try our best to provide out-of-the-box support for more popular databases.