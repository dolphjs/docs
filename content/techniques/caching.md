### Caching

Caching is a technique that stores data temporarily so that future requests for that data can be served faster.

DolphJs does not offer any **out-of-the** box implementation for this but we recommend using the [cache-manager](https://www.npmjs.com/package/cache-manager) library.

### Cache manager implementation

#### Installation

```bash
yarn add cache-manager @types/cache-manager
```

### In-memory caching

In-memory caching occurs when the cache data is stored in the system memory and not an external datastore.

We can achieve this thus:

`shared/managers/memory_cache_manager.ts`

```typescript
import { caching, MemoryCache } from "cache-manager";

class MemoryCacheManager {
  private ttl: number;
  private memoryCache: MemoryCache;

  constructor(ttl: number) {
    this.ttl = ttl;
    this.init();
  }

  private async init() {
    this.memoryCache = await caching("memory", {
      max: 100,
      ttl: this.ttl /* milliseconds */,
    });
  }

  async set(key: string, value: any, ttl?: number) {
    return this.memoryCache.set(key, value);
  }

  async get(key: string) {
    return this.memoryCache.get(key);
  }

  async del(key: string) {
    return this.memoryCache.del(key);
  }

  /**
   * You can implement other methods here
   */
}

export const memoryCache = new MemoryCacheManager(10 * 1000);
```

We have implemented three main methods to be used for storing, retrieving and removing data that is cached.

> info **Note** The In-memory cache data store can only store values of types that are supported by the [strcutured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#javascript_types).

When storing data, you can chose to use the default **TTL (expiration time in milliseconds)** which was set when the manager was instantiated or you can specify as shown below:

```typescript
await memoryCache.set("key", "value", 1000);
```

or

```typescript
await memoryCache.set("key", "value");
```

You might not want the stored data to expire, if that is the case then you set the `ttl` to **0**:

```typescript
await memoryCache.set("key", "value", 0);
```

To get the stored value:

```typescript
await memoryCache.get("key");
```

To delete the stored value:

```typescript
await memoryCache.del("key", "value");
```

> info **Info** Do well to check the [documentation](https://www.npmjs.com/package/cache-manager) so that you can add other methods based on your use case.

### MemDB

MemDB is an in-memory datastore offered by DolphJs which can be used for storing data that is not large. It can be used for caching. If the data that you will be caching isn't large then MemDB is a great choice.

#### MemDB Usage

`shared/stores/memdb.store.ts`

```typescript
import { MemDB } from "@dolphjs/dolph/packages";

export const memdb = new MemDB();
```

The reason we instantiate the `MemDB` class in a separate file instead of in the service or controller class is so that we avoid multiple instances that would result if it's instantiated in more than one file.

1. `Add` a value:

```typescript
    memdb.add("key", "value");
```

2. `Get` a value:

```typescript
    memdb.get("key");
```

3. `Remove` a value:

```typescript
    memdb.remove("key");
```

4. `Has` a value:

```typescript
    memdb.has("key");
```

5. `Get all keys`:

```typescript
    memdb.getAllKeys();
```

6. `Get all values`:

```typescript
    memdb.getAllValues();
```

7. `Empty` the data store:

```typescript
    memdb.empty();
```

> info **Note** The `has` method and `get` are similar but the `get` should be used when you are sure that the value exists and the key used to fetch it is correct, while the `has` should be used when the existence is not certain or you are not certain of the `key` passed.

### Database caching

You can make use of different databases as stores. [Redis](https://redis.io/) is the most commonly used database for caching. You can implement them by using the packages built on the `cache-manager`.

Some of them include:

1. [ioredis store](https://github.com/Tirke/node-cache-manager-stores/blob/main/packages/node-cache-manager-ioredis/README.md)
2. [mongodb store](https://github.com/Tirke/node-cache-manager-stores/blob/main/packages/node-cache-manager-mongodb/README.md)
3. [node-redis store](https://github.com/dabroek/node-cache-manager-redis-store)
4. [mongoose store](https://github.com/disjunction/node-cache-manager-mongoose)
5. [sqlite store](https://github.com/maxpert/node-cache-manager-sqlite)
