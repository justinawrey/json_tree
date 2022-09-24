# JSON Tree

Json Tree converts a JS object into a nice, visible depth-indented tree for
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

## Usage

```ts
import { jsonTree } from "https://deno.land/x/justinawrey/json_tree@{VERSION}/mod.ts";
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
deno run --allow-read https://deno.land/x/justinawrey/json_tree@1.0.0/cli.ts path sample.json
```

#### Read JSON from server

```bash
deno run --allow-net https://deno.land/x/justinawrey/json_tree@1.0.0/cli.ts fetch https://jsonplaceholder.typicode.com/users
```

#### Install globally

```bash
deno install --allow-net --allow-read -n json-tree https://deno.land/x/justinawrey/json_tree@1.0.0/cli.ts
```

Then, the binary is available to run:

```bash
json-tree
```

### Configuration

Required permissions:

1. `--allow-net`
2. `--allow-read`

## Usage

```js
jsonTree(obj, { showValues?: boolean, hideFunctions?: boolean })
```

Where:

- `obj`: json Object
- `showValues`: Whether or not to show the object values in the tree
- `hideFunctions` : Whether or not to show functions in the tree

### Screenshots

##### Console With Values

![image](https://raw.githubusercontent.com/satty1987/json_tree/master/screenshots/consoleWithValues.jpg)

##### Console Without Values

![image](https://raw.githubusercontent.com/satty1987/json_tree/master/screenshots/consoleWithoutValues.jpg)
