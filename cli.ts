import { jsonTree } from "./mod.ts";
import { readJson } from "https://deno.land/std/fs/read_json.ts";

if (import.meta.main) {
  const args = Deno.args.slice();
  const command = args.shift();
  switch (command) {
    case "path":
      for (const arg of args) {
        const data = await readJson(arg);
        console.log(jsonTree(data, true));
      }
      break;
    case "fetch":
      for (const arg of args) {
        const database = await fetch(arg);
        const data = await database.json();
        console.log(jsonTree(data, true));
      }
      break;
  }
}
