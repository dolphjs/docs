### Models

Models define the structure and validation rules for data stored in the database. Each model corresponds to a specific entity or collection, offering a consistent and structured approach to interact with the underlying data storage. By default, Dolph uses [Mongoose ODM](https://mongoosejs.com/) for **MongoDB** interactions and schema design, and [Sequelize ORM](https://sequelize.org/) for **MySQL** and **PostgreSQL** interactions and schema design.

Example of a mongoose model:

```typescript
@@filename(user.model)
import { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
}

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

export const UserModel = model<IUser>("users", UserSchema);
@@switch
const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const UserModel = model("users", UserSchema);
module.exports = { UserModel };
```

Example of mysql model:

```typescript
@@filename(user.model)
import { sequelizeInstance } from "@/shared/configs/db.configs";
import { DataTypes } from "sequelize";

export const Msg = sequelizeInstance.define("msg", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  }
});
@@switch
const { sequelizeInstance } = require("@/shared/configs/db.configs");
const { DataTypes } = require("sequelize");

const Msg = sequelizeInstance.define("msg", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  }
});

module.exports = { Msg };
```

<strong>IUser</strong>

It's conventional to name the document interfaces  by starting with an **I** and following with the uppercase for the first letter of the entity.

**IUser Interface**: Defines the structure of the document using TypeScript. It extends the Document interface provided by Mongoose.

**UserSchema**: Describes the schema for the model using the Mongoose Schema class. It includes the fields (name and email) with their respective data types and validation rules.

**UserModel Export**: Creates a Mongoose model named "users" based on the defined schema. The model is exported for use in other parts of the application.

#### Using models with services

In this example, we'll show how to us  inject a **mongoose** and **mysql** model into our `UserService` file:

##### MongoDb Model

```typescript
@@filename(user.service)
import { DolphServiceHandler } from "@dolphjs/dolph/classes";
import { Dolph } from "@dolphjs/dolph/common";
import { InjectMongo} from "@dolphjs/dolph/decorators";
import { Model } from "mongoose";
import { UserModel, IUser } from "./user.model";


@InjectMongo("userModel", UserModel)
export class UserService extends DolphServiceHandler<Dolph> {
  protected readonly userModel!: Model<IUser>;

  constructor() {
    super("userservice");
  }
}
```
Let's breakdown what we have in the code above:

**InjectMongo** - this decorator is used to inject a **mongo model** into the service class. The **InjectMongo** decorator is used to inject a MongoDB model into a Dolph service class, facilitating seamless interaction with the specified MongoDB collection. It simplifies the process of accessing and manipulating data within the MongoDB database.

- **userModel** - the property name used to bind the injected model within the service class.
- **UserModel** -  the Mongoose model representing the MongoDB collection to be injected.
- **Model\<IUser>** - A Mongoose model representing the structure and behavior of the MongoDB collection for user data.

The **userModel** property is a protected, readonly property within the `UserService` class. It holds the Mongoose model for the MongoDB collection associated with user data. This property is injected and bound using the `@InjectMongo()` decorator.

> info **Hint** Ensure that the property name used in **@InjectMongo("userModel", UserModel)** matches the property name within the service class **(protected readonly userModel!: Model\<IUser>)**.

##### MySQL Model

```typescript
@@filename(user.model)
import { DolphServiceHandler } from "@dolphjs/dolph/classes";
import { Dolph } from "@dolphjs/dolph/common";
import { InjectMySQL } from "@dolphjs/dolph/decorators";
import { ModelStatic, Model } from "sequelize";


@InjectMySQL("userModel", )
export class UserService extends DolphServiceHandler<Dolph> {
  userModel!: ModelStatic<Model<any, any>>

  constructor() {
    super("userservice");
  }
}
```

Let's breakdown what we have in the code above:

**InjectMysql**: this decorator is used to inject a Sequelize model into a Dolph service class, facilitating interaction with the specified **MySQL** database table. This decorator simplifies the process of accessing and manipulating data within the **MySQL** database.

- **userModel** - the property name to bind the injected model to within the service class. The userModel property is a public property within the UserService class. It holds the Sequelize model for the **MySQL** table associated with user data. This property is injected and bound using the `@InjectMySQL()` decorator.

- **ModelStatic\<Model<any, any>>**: A Sequelize model representing the structure and behavior of the MySQL table for user data.

> info **Hint** Ensure that the property name used in **@InjectMySQL("userModel")** matches the property name within the service class **(userModel!: ModelStatic\<Model<any, any>>)**. The [Sequelize](https://sequelize.org/) model comes with built-in methods for CRUD operations, making it convenient to interact with the MySQL database.