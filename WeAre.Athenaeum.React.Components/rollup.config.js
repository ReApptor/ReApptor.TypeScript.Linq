import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import resolve from "@rollup/plugin-node-resolve";
import url from "@rollup/plugin-url";
import image from '@rollup/plugin-image';

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
        },
    ],

    plugins: [
        image(),
        postcss({
            modules: true,
        }),
        url(),
        resolve(),
        typescript({
            rollupCommonJSResolveHack: true,
            clean: true,
            transformers: [() => ({
                before: [ tsNameOf ],
                after: []
            })]
        }),
        commonjs(),
    ],

};
