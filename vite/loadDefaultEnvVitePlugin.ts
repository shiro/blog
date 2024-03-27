import { Plugin } from "vite";

import dotenvExtended from "dotenv-extended";
import dotenvParseVariables from "dotenv-parse-variables";
import path from "path";

const root = path.join(process.cwd(), "..");

let env: any = dotenvExtended.load({
    path: path.join(root, ".env.defaults"),
    includeProcessEnv: false,
    assignToProcessEnv: false,
});
env = dotenvParseVariables(env, { assignToProcessEnv: false });

const variableEnv =
    process.env.NODE_ENV === "production"
        ? (() => {
              const env: any = dotenvExtended.load({
                  path: path.join(root, ".env.production.defaults"),
                  includeProcessEnv: false,
                  assignToProcessEnv: false,
              });

              return dotenvParseVariables(env, { assignToProcessEnv: false });
          })()
        : {};

env = { ...env, ...variableEnv };

const define = {};
for (const [k, v] of Object.entries(env)) {
    define[`import.meta.env.${k}`] = JSON.stringify(v);
}
export const loadDefaultEnvVitePlugin: Plugin = {
    name: "load-default-env",
    config: () => ({ define }),
};
