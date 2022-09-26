import { colors } from "./deps.ts";

type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

type KeyTransformFn = (
  key: string,
  leaf: boolean,
) => string;

type ValueTransformFn = (value: string) => string;

interface Options {
  showValues?: boolean;
  align?: boolean;
  seperator?: string;
  keyTransform?: KeyTransformFn;
  valueTransform?: ValueTransformFn;
}

interface Line {
  prefix: string;
  key: string;
  value?: string;
  leaf: boolean;
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
  lines: Line[],
) {
  let index = 0;
  let lastKey;
  let circular = false;

  const lastStatesCopy = lastStates.slice(0);

  let prefix = "";
  if (lastStatesCopy.push({ tree: root, last }) && lastStates.length > 0) {
    lastStates.forEach(({ tree, last }, idx) => {
      if (idx > 0) {
        prefix += (last ? " " : "│") + "  ";
      }
      if (!circular && tree === root) {
        circular = true;
      }
    });

    // Figure out if we're on a leaf node
    let folder: boolean;
    if (typeof root === "object" && root !== null) {
      folder = Object.keys(root).length > 0;
    } else if (Array.isArray(root)) {
      folder = root.length > 0;
    } else {
      folder = false;
    }

    prefix += makePrefix(key, last);

    let value: string | undefined;
    const terminated = typeof root !== "object" || root === null;

    if (terminated) {
      value = root === null ? "null" : root.toString();
    }

    if (terminated && circular) {
      value += " (circular ref.)";
    }

    lines.push({
      prefix,
      key,
      value,
      leaf: !folder,
    });
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
        lines,
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
    align: false,
    seperator: ": ",
    keyTransform: (prevLine) => colors.gray(prevLine),
    valueTransform: (prevLine) => prevLine,
  };

  const {
    keyTransform,
    seperator,
    valueTransform,
    align,
    showValues,
  } = { ...baseOptions, ...options };

  const lines: Line[] = [];
  growBranch(
    ".",
    obj,
    false,
    [],
    lines,
  );

  function joinLines(lines: Line[], maxLen = 0): string {
    const outLines: string[] = [];

    for (const { prefix, key, value, leaf } of lines) {
      const padding = maxLen - prefix.length - key.length;
      let line = prefix + keyTransform(key, leaf);

      if (showValues && value) {
        const paddingString = padding > 0 ? new Array(padding).join(" ") : "";
        line += paddingString + seperator +
          valueTransform(value);
      }

      outLines.push(line);
    }

    return outLines.join("\n");
  }

  if (align) {
    let maxLen = 0;
    for (const { prefix, key } of lines) {
      const len = prefix.length + key.length;

      if (len > maxLen) {
        maxLen = len;
      }
    }

    return joinLines(lines, maxLen + 1);
  }

  return joinLines(lines);
}
