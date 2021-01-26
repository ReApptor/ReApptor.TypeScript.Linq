import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import autoExternal from 'rollup-plugin-auto-external';
import postcss from "rollup-plugin-postcss";
import resolve from "@rollup/plugin-node-resolve";
import url from "@rollup/plugin-url";
import svgr from "@svgr/rollup";
import tsNameOf from 'ts-nameof';
import pkg from "./package.json";

export default {
    input: "src/index.ts",
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
        autoExternal(),
        postcss({
            modules: true,
        }),
        url(),
        svgr(),
        resolve(),
        typescript({
            rollupCommonJSResolveHack: true,
            clean: true,
            transformers: [service => ({
                before: [ tsNameOf ],
                after: []
            })]
        }),
        commonjs({
        })
    ],

};
