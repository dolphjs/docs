## Cookies

A Cookie is used to store data on a browser. The cookie is sent from the server to the client and sent from the client to the server for every request made to the server.

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

