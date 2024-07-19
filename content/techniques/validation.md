## Validation

Validation has a  very important role to play when building APIs. It checks for the correctness of the data being sent by the client and handles any errors based on requirements before passing the data to the service in-charge of processing it.

Dolph provides only one out-of-the box way for doing this:

- [Joi](https://www.npmjs.com/package/joi) : dolph makes use of the **Joi** package.

- [class-validator](https://www.npmjs.com/package/class-validator): dolph makes use of the **class-validator** package


### Joi

In your user.validation.ts file:

```typescript
import { joi as Joi } from "@dolphjs/dolph/packages";

export const userValidation = {
  body: Joi.object().keys({
    age: Joi.number().required(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
  }),
};
```

Now, we can use the `userValidation` schema in our **user.controller.ts** file to perform request payload validation:

```typescript
 @Post()
  @TryCatchDec
  @ValidateReq(userValidation)
  async newUser(req: DRequest, res: DResponse): Promise<void> {
    this.userService.create(req.body);
    SuccessResponse({
      res,
      body: { message: "user created successfully"},
    });
```

>info **Hint** You are not limited to validating **body** request, but you can do same for: `params`, and `query` as  seen below:

```typescript
export const userValidation = {
  params: Joi.object().keys({
    id: Joi.string().email().required(),
  }),
};
```

```typescript
export const userValidation = {
  query: Joi.object().keys({
    limit: Joi.number().default(10),
    page: Joi.number().default(1),
  }),
};
```

### Class-Validator

In your user.dto.ts file:

```typescript
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  age: number;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
```

In your user.controller.ts file:

```typescript
import { CreateUserDto } from './user.dto';
import { validateBodyMiddleware } from "@dolphjs/dolph/common";

 @Post('user')
  @UseMiddleware(validateBodyMiddleware(CreateUserDto))
  async createUser(req: DRequest, res: DResponse) {
    const dto: CreateUserDto = req.body;
    SuccessResponse({ res, body: dto });
  }
```

The three middlewares usable with the **class-validator** validation are:
- **validateBodyMiddleware** : used for validating request body
- **validateQueryMiddleware** : used for validating request query params
- **validateParamMiddleware**: used for validating request path params

>info **Hint** When installing the **class-validator** package, do well to download the **class-transformer** package too else your code wouldn't work as expected.