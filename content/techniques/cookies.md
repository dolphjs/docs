## Cookies

A Cookie is used to store data on a browser. The cookie is sent from the server to the client and sent from the client to the server for every request made to the server.

Though the cookie service together with the jwt service would come as a special and standalone package by the time version 1.6 of Dolph is out, until then we have a little aid offered for working with cookies.

To create a cookie in Dolph, below is a sample where `newAuthCookie` is imported from dolph's **utilities** directory. I.e `@dolphjs/dolph/utilities``:

```typescript
  @Post("login")
  @ValidateReq(userValidation)
  async login(req: DRequest, res: DResponse): Promise<void> {
    const { email } = req.body;

    const cookieDetails = newAuthCookie(email, 10000, "random_secret");

    res.cookie(cookieDetails.name, cookieDetails.value, {
      expires: cookieDetails.expires,
      secure: cookieDetails.secure,
      httpOnly: cookieDetails.httpOnly,
    });

    SuccessResponse({ res, body: { message: "login successful" } });
}
```

