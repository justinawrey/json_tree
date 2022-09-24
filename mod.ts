type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

type lineTransform = (
  prevLine: string,
  flags: { last: boolean },
) => string;

interface Options {
  showValues?: boolean;
  lineTransform?: lineTransform;
}

interface State {
  tree: JSONValue;
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

function growBranch(
  key: string,
  root: JSONValue,
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
    options.showValues &&
      (typeof root !== "object" || root === null) &&
      (line += ": " + root);
    circular && (line += " (circular ref.)");

    currTree.tree += options.lineTransform(line, { last });
    currTree.tree += "\n";
  }

  if (!circular && typeof root === "object" && root !== null) {
    const keys = Object.keys(root);
    keys.forEach(function (branch) {
      lastKey = ++index === keys.length;
      growBranch(
        branch,
        // @ts-ignore temporary refactor
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
  obj: JSONValue,
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
