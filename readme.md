# jsontree

`jsontree` converts a JS object into a nice, visible depth-indented tree for
console printing. The structure generated is similar to what you get by running
the `tree` command on Unixy platforms.

```
{
    oranges: {
        'mandarin': {                                          ├─ oranges
            clementine: null,                                  │  └─ mandarin
            tangerine: 'so cheap and juicy!'        -=>        │     ├─ clementine
        }                                                      │     └─ tangerine: so cheap and juicy!
    },                                                         └─ apples
    apples: {                                                     ├─ gala
        'gala': null,                                             └─ pink lady
        'pink lady': null
    }
}
```

It also works well with larger nested hierarchies such as file system directory
trees.

## Quick start

### Programmatic

```ts
import { jsonTree } from "https://deno.land/x/jsontree@{VERSION}/mod.ts";
console.log(
  jsonTree({
    apples: "gala", //  ├─ apples: gala
    oranges: "mandarin", //  └─ oranges: mandarin
  }),
);
```

### CLI

Alternatively, you can use it directly from the CLI:

#### Read JSON from local directory

```bash
deno run --allow-read https://deno.land/x/jsontree@1.0.0/cli.ts path sample.json
```

#### Read JSON from server

```bash
deno run --allow-net https://deno.land/x/jsontree@1.0.0/cli.ts fetch https://jsonplaceholder.typicode.com/users
```

#### Install globally

```bash
deno install --allow-net --allow-read -n jsontree https://deno.land/x/jsontree@1.0.0/cli.ts
```

Then, the binary is available to run:

```bash
jsontree
```

## Configuration

Required permissions:

1. `--allow-net` (if using cli `fetch` option)
2. `--allow-read` (if using cli `path` option or programmatic API)

## Usage

```js
jsonTree(obj, { showValues?: boolean })
```

Where:

- `obj`: json object
- `showValues`: whether or not to show the object values in the tree

## Screenshots

### With Values

![image](https://raw.githubusercontent.com/satty1987/json_tree/master/screenshots/consoleWithValues.jpg)

### Without Values

![image](https://raw.githubusercontent.com/satty1987/json_tree/master/screenshots/consoleWithoutValues.jpg)

## Acknowledgement

This is a fork of the original
[satty1987/json_tree](https://github.com/satty1987/json_tree) module.
