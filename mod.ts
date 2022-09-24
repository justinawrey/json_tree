// deno-lint-ignore no-explicit-any
type JSON = Record<string, any>;

interface Options {
  showValues?: boolean;
  hideFunctions?: boolean;
}

function makePrefix(key: string, last: boolean) {
  let str = (last ? "└" : "├");
  if (key) {
    str += "─ ";
  } else {
    str += "──┐";
  }
  return str;
}

function filterKeys(obj: JSON, hideFunctions: boolean) {
  const keys = [];
  for (const branch in obj) {
    if (!(branch in obj)) {
      continue;
    }
    if (hideFunctions && ((typeof obj[branch]) === "function")) {
      continue;
    }
    keys.push(branch);
  }
  return keys;
}

function growBranch(
  key: string,
  root: JSON,
  last: boolean,
  lastStates: [JSON, boolean][],
  options: Required<Options>,
  callback: (prevLine: string) => void,
) {
  let line = "";
  let index = 0;
  let lastKey;
  let circular = false;

  const lastStatesCopy = lastStates.slice(0);

  if (lastStatesCopy.push([root, last]) && lastStates.length > 0) {
    lastStates.forEach(([tree, last], idx) => {
      if (idx > 0) {
        line += (last ? " " : "│") + "  ";
      }
      if (!circular && tree === root) {
        circular = true;
      }
    });
    line += makePrefix(key, last) + key;
    options.showValues && (typeof root !== "object" || root instanceof Date) &&
      (line += ": " + root);
    circular && (line += " (circular ref.)");

    callback(line);
  }

  if (!circular && typeof root === "object") {
    const keys = filterKeys(root, options.hideFunctions);
    keys.forEach(function (branch) {
      lastKey = ++index === keys.length;
      growBranch(
        branch,
        root[branch],
        lastKey,
        lastStatesCopy,
        options,
        callback,
      );
    });
  }
}

export function jsonTree(
  obj: JSON,
  options: Required<Options> = {
    showValues: true,
    hideFunctions: false,
  },
) {
  let tree = "";
  growBranch(
    ".",
    obj,
    false,
    [],
    options,
    function (line) {
      tree += line + "\n";
    },
  );
  return tree;
}
