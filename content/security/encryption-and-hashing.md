### Encryption

Encryption is a process of converting plaintext (ordinary text) into ciphertext (encoded text) to secure sensitive data. It ensures that only authorized parties can access and read the information, protecting it from unauthorized access or interception.

There are two types of encryptions based on keys used and Dolph offers support for both of them:

1. Symmetric Encryption
2. Asymmetric Encryption

To read more about these types of encryptions, you can check [here](https://www.freecodecamp.org/news/encryption-explained-in-plain-english/).

Encryption could be used to represent sensitive data stored in applications or used for communication. This sensitive data could include passwords, access keys, PINs, etc.

DolphJS offers encryption and hashing with the option to choose between the `bcrypt` or `argon2` implementations. If you are transitioning from another Node.js framework, this feature is likely familiar to you, and the implementation with DolphJS is straightforward and simplified.

To make use of the **bcrypt** implementation, import the `hashWithBcrypt` function from the `utilities` directory:

```typescript
const password = await hashWithBcrypt({pureString: "password", salt: 11});
```

The above code example demonstrates symmetric encryption. The `pureString` field is mandatory and expects the string to be hashed, while the `salt` field is optional and defaults to **11**. The `salt` field specifies the number of rounds for encrypting the provided string.

To make use of the **argon2** implementation, import the `hashWithArgon` function from the `utilities` directory:

```typescript
const hashedString = await hashWithArgon({
    pureString: 'password',
    salt: 'mysalt',
    memoryCost: 4096,
    secret: 'mysecret',
    version: 3,
    parallelism: 2,
    raw: false,
    type: 'argon2id',
    timeCost: 10
});
```

The `hashWithArgon` function is used to hash a plaintext string using the Argon2 hashing algorithm. Argon2 is a modern and secure hashing algorithm designed to provide resistance against various types of attacks, including GPU and side-channel attacks.

##### Parameters

- **pureString:** `Required`. The plaintext string that you want to hash.
- **salt:** `Optional`. Specifies the salt value used in the hashing process.
- **memoryCost:**: `Optional`. Specifies the memory cost parameter for the Argon2 algorithm.
- **secret:** `Optional`. Specifies a secret value used in the hashing process.
- ***version:**: `Optional`. Specifies the version of the Argon2 algorithm to use.
- **parallelism:**: `Optional`. Specifies the degree of parallelism for the Argon2 algorithm.
- **raw:** `Optional`. Boolean flag indicating whether to return raw bytes or encoded hash.
- **type:**: `Optional`. Specifies the Argon2 variant (Argon2i, Argon2d, Argon2id).
- **timeCost**: `Optional`. Specifies the time cost parameter for the Argon2 algorithm.

There are other libraries that can be used to perform encryption and hashing. An example of this is the crypto library that is offered by the node runtime, read more about it [here](https://nodejs.org/api/crypto.html).



### Decryption

Decryption is the process of converting ciphertext (encoded text) back into plaintext (ordinary text) to retrieve and access sensitive information that was previously encrypted. It allows authorized parties to read the original data, ensuring data confidentiality is maintained throughout transmission and storage.

There are two types of decryption based on keys used, and Dolph offers support for both of them:

1. Symmetric Decryption: In symmetric decryption, the same key used for encryption is also used for decryption. This key must be securely shared between the sender and receiver.

2. Asymmetric Decryption: Asymmetric decryption uses a pair of keys: a public key for encryption and a private key for decryption. The public key can be freely distributed, while the private key remains confidential.

DolphJS provides comprehensive support for decryption, complementing its encryption and hashing capabilities. It offers seamless integration with common decryption algorithms and methods, ensuring straightforward implementation and management within Node.js applications.

From the encryption section of this page, we discussed how to use the `bcrypt` and `argon2` implementations for encryption and now we would learn how to decrypt those generated encrypted strings: