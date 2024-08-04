### Encryption

Encryption is a process of converting plaintext (ordinary text) into ciphertext (encoded text) to secure sensitive data. It ensures that only authorized parties can access and read the information, protecting it from unauthorized access or interception.

There are two types of encryptions based on keys used and NodeJs offers support for both of them:

1. Symmetric Encryption
2. Asymmetric Encryption

To read more about these types of encryptions, you can check [here](https://www.freecodecamp.org/news/encryption-explained-in-plain-english/).

Encryption could be used to represent sensitive data stored in applications or used for communication.

```typescript
import { createCipheriv, randomBytes, scryptSync } from 'crypto';

const iv = randomBytes(16);
const password = 'Password';

const key = scryptSync(password, 'salt', 32);
const cipher = createCipheriv('aes-256-ctr', key, iv);

const textToEncrypt = 'My Secret Text';
const encryptedText = Buffer.concat([
  cipher.update(textToEncrypt, 'utf8'),
  cipher.final(),
]);

console.log('Encrypted text:', encryptedText.toString('hex'));

```

### Decryption

Decryption is the process of converting ciphertext (encoded text) back into plaintext (ordinary text) to retrieve and access sensitive information that was previously encrypted. It allows authorized parties to read the original data, ensuring data confidentiality is maintained throughout transmission and storage.

There are two types of decryption based on keys used, and NodeJs offers support for both of them:

1. Symmetric Decryption: In symmetric decryption, the same key used for encryption is also used for decryption. This key must be securely shared between the sender and receiver.

2. Asymmetric Decryption: Asymmetric decryption uses a pair of keys: a public key for encryption and a private key for decryption. The public key can be freely distributed, while the private key remains confidential.

To `decrypt` the encrypted text above:  

```typescript
import { createDecipheriv } from 'crypto';

const decipher = createDecipheriv('aes-256-ctr', key, iv);
const decryptedText = Buffer.concat([
  decipher.update(encryptedText),
  decipher.final(),
]);
```

### Hashing

DolphJS offers hashing using `bcrypt` . If you are transitioning from another Node.js framework, this feature is likely familiar to you, and the implementation with DolphJS is straightforward and simplified.

To make use of the **bcrypt** implementation, import the `hashWithBcrypt` function from the `utilities` directory:

```typescript
import { hashWithBcrypt } from "@dolphjs/dolph/utilities";

const hashedPassword = await hashWithBcrypt({pureString: "password", salt: 11});
```

The above code example demonstrates symmetric encryption. The `pureString` field is mandatory and expects the string to be hashed, while the `salt` field is optional and defaults to **11**. The `salt` field specifies the number of rounds for encrypting the provided string.

There are other libraries that can be used to perform encryption and hashing. An example of this is the crypto library that is offered by the node runtime, read more about it [here](https://nodejs.org/api/crypto.html).

To compare the hashed string with a plain string (not hashed):

```typescript
import { compareWithBcryptHash } from "@dolphjs/dolph/utilities";

const isMatch =  await compareWithBcryptHash({pureString: "password", hashString: hashedPassword })
```
