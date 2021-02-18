import ttypescript from "ttypescript";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import image from '@rollup/plugin-image';
import tsNameOf from 'ts-nameof';
import pkg from "./package.json";

export default {
    input: "src/index.ts",
    external: [
        ...Object.keys(pkg.dependencies),
        ...Object.keys(pkg.devDependencies),
        ...Object.keys(pkg.peerDependencies)
    ],    
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
        image(),
        postcss({
            modules: true,
        }),
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
