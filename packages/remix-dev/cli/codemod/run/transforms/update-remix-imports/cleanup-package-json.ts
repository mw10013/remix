import { writeFile } from "fs/promises";
import sort from "sort-package-json";
import type { PackageJson } from "type-fest";

import { runtimes } from "./jscodeshift-transform";

const getNewPostInstall = (postinstall?: string) =>
  postinstall &&
  runtimes.map((runtime) => `remix setup ${runtime}`).includes(postinstall)
    ? undefined
    : postinstall;

type CleanupPackageJsonArgs = {
  content: PackageJson;
  path: string;
};
export const cleanupPackageJson = async ({
  content: { dependencies, scripts, ...packageJson },
  path,
}: CleanupPackageJsonArgs) => {
  let newPackageJson = {
    ...packageJson,
    dependencies: {
      ...dependencies,
      remix: undefined,
    },
    scripts: {
      ...scripts,
      postinstall: getNewPostInstall(scripts?.postinstall),
    },
  };

  let formattedPackageJson =
    JSON.stringify(sort(newPackageJson), null, 2) + "\n";
  return writeFile(path, formattedPackageJson);
};