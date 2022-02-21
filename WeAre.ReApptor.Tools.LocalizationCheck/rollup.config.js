import pkg from "./package.json";
import nodeResolve from '@rollup/plugin-node-resolve';
import commonJs from '@rollup/plugin-commonjs';
import ttypescript from "ttypescript";
import typescript from "rollup-plugin-typescript2";
import {preserveShebangs} from 'rollup-plugin-preserve-shebangs';

export default {
    input: "src/index.ts",
    external: [
        ...Object.keys(pkg.dependencies || {}) ,
        ...Object.keys(pkg.devDependencies || {}),
        ...Object.keys(pkg.peerDependencies || {})
    ],    
    output: [
        {
            banner: '#!/usr/bin/env node',
            file: pkg.main,
            format: "cjs",
            exports: "named",
            sourcemap: true,
        },
        {
            banner: '#!/usr/bin/env node',
            file: pkg.module,
            format: "es",
            exports: "named",
            sourcemap: true,
        }
    ],
    plugins: [
        preserveShebangs(),
        nodeResolve({
            extensions: ['.ts']
        }),
        commonJs(),
        typescript({
            typescript: ttypescript,
            clean: true,
            useTsconfigDeclarationDir: true,
            transformers: [() => ({
                before: [  ],
                after: [  ]
            })],
            tsconfigOverride: {
                compilerOptions: {
                    sourceMap: true,
                    inlineSourceMap: true,
                    plugins: [
                    ],
                }
            }
        })
    ],

};
