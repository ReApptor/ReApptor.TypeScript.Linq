import ttypescript from "ttypescript";
import typescript from "rollup-plugin-typescript2";
import tsNameOf from 'ts-nameof';
import pkg from "./package.json";

export default {
    input: "src/index.ts",
    external: [...Object.keys(pkg.dependencies), Object.keys(pkg.devDependencies)],
    output: [
        {
            file: pkg.main,
            format: "cjs",
            exports: "named",
            sourcemap: true,
        },
        {
            file: pkg.module,
            format: "es",
            exports: "named",
            sourcemap: true,
        }
    ],

    plugins: [
        typescript({
            typescript: ttypescript,
            clean: true,
            useTsconfigDeclarationDir: true,
            transformers: [() => ({
                before: [ tsNameOf ],
                after: [  ]
            })],
            tsconfigOverride: {
                compilerOptions: {
                    "plugins": [
                        { "transform": "typescript-transform-paths" },
                        { "transform": "typescript-transform-paths", "afterDeclarations": true }
                    ],
                }
            }
        }),
    ],

};
