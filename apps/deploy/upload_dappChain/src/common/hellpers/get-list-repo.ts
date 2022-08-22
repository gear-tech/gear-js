import { readFileSync } from "fs";
import { load } from "js-yaml";

// eslint-disable-next-line consistent-return
export function getListRepo(): { repo: string }[] {
  const path = "/../../../src/common/repos/dapps-repo.yaml";
  try {
    // eslint-disable-next-line no-path-concat
    return load(readFileSync(__dirname + path, "utf8")) as { repo: string }[];
  } catch (err) {
    console.error(err);
  }
}
