### Overview

The Helmet package is a collection of middleware functions designed to improve the security of web applications. It helps to set various HTTP headers to prevent common web vulnerabilities.

Helmet can be configured using the **dolph_config** file as shown below:

```yaml
middlewares:
  helmet:
    contentSecurityPolicy:
      directives:
        defaultSrc:
          - "'self'"
        scriptSrc:
          - "'self'"
          - "trusted-cdn.com"
      
    expectCt:
      enforce: true
      maxAge: 30

    featurePolicy:
      features:
        fullscreen:
          - "'self'"
        vibrate:
          - "'none'"

    referrerPolicy:
      policy: "same-origin"

    hsts:
      maxAge: 31536000
      includeSubDomains: true

    crossOriginEmbedderPolicy:
      policy: "require-corp"

    crossOriginOpenerPolicy:
      policy: "same-origin"
```

- **contentSecurityPolicy:** Sets directives for Content Security Policy (CSP) to prevent XSS attacks.
- **expectCt:** Enables Expect-CT header to enforce certificate transparency.
- **featurePolicy:** Defines which features and APIs are allowed to be used in the web application.
- **referrerPolicy:** Sets the Referrer-Policy header to control referrer information.
- **hsts:** Configures Strict-Transport-Security to enforce HTTPS connections.
- **crossOriginEmbedderPolicy:** Sets Cross-Origin-Embedder-Policy to control how resources are handled in cross-origin embedder contexts.
- **crossOriginOpenerPolicy:** Sets Cross-Origin-Opener-Policy to control how documents are opened in cross-origin browsing contexts.

> info **Hint** all fields for the helmet configurations are optional.