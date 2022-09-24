// deno-lint-ignore no-explicit-any
type JSON = Record<string, any>;

interface Options {
  showValues?: boolean;
  lineTransform?: (
    prevLine: string,
    flags: { last: boolean },
  ) => string;
}

interface State {
  tree: JSON;
  last: boolean;
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

function filterKeys(obj: JSON) {
  const keys = [];
  for (const branch in obj) {
    if (!(branch in obj)) {
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
  lastStates: State[],
  currTree: { tree: string },
  options: Required<Options>,
) {
  let line = "";
  let index = 0;
  let lastKey;
  let circular = false;

  const lastStatesCopy = lastStates.slice(0);

  if (lastStatesCopy.push({ tree: root, last }) && lastStates.length > 0) {
    lastStates.forEach(({ tree, last }, idx) => {
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

    currTree.tree += options.lineTransform(line, { last });
    currTree.tree += "\n";
  }

  if (!circular && typeof root === "object") {
    const keys = filterKeys(root);
    keys.forEach(function (branch) {
      lastKey = ++index === keys.length;
      growBranch(
        branch,
        root[branch],
        lastKey,
        lastStatesCopy,
        currTree,
        options,
      );
    });
  }
}

export default function jsonTree(
  obj: JSON,
  options: Options = {},
) {
  const baseOptions: Required<Options> = {
    showValues: true,
    lineTransform: (prevLine) => prevLine,
  };

  const mergedOptions = { ...baseOptions, ...options };

  const currTree = { tree: "" };
  growBranch(
    ".",
    obj,
    false,
    [],
    currTree,
    mergedOptions,
  );

  return currTree.tree;
}
