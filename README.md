
# Deno MayLily

[![nest.land](https://nest.land/badge.svg)](https://nest.land/package/deno-maylily)

A copy of [Maylily](https://github.com/shimataro/maylily/) a distributable, serverless, and customizable unique ID generator based on [Snowflake](https://github.com/twitter/snowflake/tree/snowflake-2010/). Made compatible with deno

## Features

* distributable / scalable
* no external servers required
* customizable
* supports 2-36 radix
* supports multiple precision integer

## How to import

Import with `nest.land`.

```typescript
import maylily from "https://x.nest.land/deno-maylily@1.0.0/mod.ts";
```
Or use `deno.land`.
```typescript
import maylily from  "https://deno.land/x/deno-maylily@1.0.0/mod.ts";
```

## How to use

No external servers needed.
Just import and call `maylily()`!

```typescript
import maylily from "https://x.nest.land/deno-maylily@1.0.0/mod.ts";

try {
  const id = await maylily();
  // do something...
} catch (err) {
  // err is instance of Error
}
```

## How to customize

| name | description | default |
|------|-------------|---------|
| `radix` | radix of generated ID (2-36) | 10 |
| `timeBase` | base time in unixtime(millisec) | 946684800000 (2000-01-01T00:00:00Z) |
| `machineId` | identifier of machine; must be unique in service | 0 |
| `machineBits` | required bits to represent machineId | 3 |
| `generatorId` | identifier of generator; must be unique in machine | process ID |
| `generatorBits` | required bits to represent generatorId | 10 |
| `sequenceBits` | required bits to represent sequence | 8 |

Generated value is stringified multiple precision integer (in specified radix).

```
 000001011100000101111010101110101010111101 001 1101101010 00000110
|------------------------------------------|                         current time from timeBase in millisec
                                           |---|                     machineId (uses machineBits bits)
                                               |----------|          generatorId (uses generatorBits bits)
                                                          |--------| sequence number (uses sequenceBits bits)
```

example:

```javascript
// keeps options until next change
maylily({
  timeBase: Date.parse("2017-01-01T00:00:00Z"),   // if your service starts in 2017, this is enough.
  machineBits: 1                                  // if required number machines are up to 2, this is enough.
});
```
