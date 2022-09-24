import { jsonTree } from "./mod.ts";

if (import.meta.main) {
  const args = Deno.args.slice();
  const command = args.shift();
  switch (command) {
    case "path":
      for (const arg of args) {
        const data = await import(arg, { assert: { type: "json" } });
        console.log(jsonTree(data));
      }
      break;
    case "fetch":
      for (const arg of args) {
        const database = await fetch(arg);
        const data = await database.json();
        console.log(jsonTree(data));
      }
      break;
  }
}
