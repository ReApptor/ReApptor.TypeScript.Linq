import ttypescript from "ttypescript";
import typescript from "rollup-plugin-typescript2";
import tsNameOf from "ts-nameof";
import pkg from "./package.json";
import postcss from "rollup-plugin-postcss";
import image from "@rollup/plugin-image";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonJs from '@rollup/plugin-commonjs';

export default {
    input: "src/index.ts",
    external: [
        ...Object.keys(pkg.dependencies || {}) ,
        ...Object.keys(pkg.devDependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
        "date-fns/locale/fi",
        "date-fns/locale/pl",
        "date-fns/locale/sv",
        "date-fns/locale/en-GB"
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
        nodeResolve(),
        commonJs(),
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
                    sourceMap: true,
                    inlineSourceMap: true,
                    plugins: [
                        { "transform": "typescript-transform-paths" },
                        { "transform": "typescript-transform-paths", "afterDeclarations": true }
                    ],
                }
            }
        }),
    ],

};
