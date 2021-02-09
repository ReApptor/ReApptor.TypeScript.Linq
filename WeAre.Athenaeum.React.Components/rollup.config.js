import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import image from '@rollup/plugin-image';
import tsNameOf from 'ts-nameof';
import pkg from "./package.json";

export default {
    input: "src/index.ts",
    external: [...Object.keys(pkg.dependencies), Object.keys(pkg.devDependencies)],
    output: [
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
        typescript({
            clean: true,
            transformers: [() => ({
                before: [ tsNameOf ],
                after: []
            })]
        })
    ],

};
