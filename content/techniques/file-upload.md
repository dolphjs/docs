## File Upload

Handling file upload is very straightforward, Dolph provides a decorator built on the [multer](https://github.com/expressjs/multer) package. Multer handles data posted in the multipart/form-data format, which is primarily used for uploading files via an HTTP **POST** request.

> warn **warn** Multer cannot process data which is not in the supported multipart format **(multipart/form-data)**.

To enjoy Typescript's types safety, let's install the multer types package:

```typescript
yarn add @types/multer -D
```

To upload files, you'll need to call the `@MediaParser` decorator on the controller method that processes the file request as seen below:

```typescript
@Post("new")
  @TryCatchDec
  @ValidateReq(userValidation)
  @MediaParser({ fieldname: "upload", type: "single" })
  async newUser(req: DRequest, res: DResponse): Promise<void> {
    console.log(req.file)
    service.create(req.body);
    SuccessResponse({
      res,
      body: { message: "user created successfully", file: req.file },
    });
  }
```

If you pass a multipart file with the name `upload`, you should see it logged when the request has been made.
The `@MediaParser` decorator accepts a param of type `IMediaParserOptions`.

**IMediaParserOptions** accepts these fields:

-  **fieldname**: the name attributed to the file(s) to be uploaded
- **type**: the type of data to expect, `array` or `single` data
- **extensions**: an array of allowed file extensions. If the field is left empty, a default array of numerous popular file formats is used
- **limit**: this is only applicable to `array` type of file(s). It set's the limit to be uploaded at once
- **storage**: of type `multer.DiskStorageOptions`. Please see the [multer](https://github.com/expressjs/multer) docs to learn more about this field

