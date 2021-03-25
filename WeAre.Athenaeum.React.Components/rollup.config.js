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
            autoModules: true,
            modules: {
                generateScopedName: function (name, filename, css) {
                    const path = require("path");
                    const file = path.basename(filename);
                    const isModule = file.endsWith(".module.scss");
                    if (!isModule) throw new Error("supported only *module.scss files");
                    const className = file.split(".module.scss")[0];
                    const kebabCaseClassName = className.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase()
                    return `${kebabCaseClassName}-${name}`
                },
            },
            extract: false
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
