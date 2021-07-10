import path from "path";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonJs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import image from "@rollup/plugin-image";
import postcss from "rollup-plugin-postcss";
import typescript from "rollup-plugin-typescript2";
import ttypescript from "ttypescript";
import tsNameOf from "ts-nameof";

const PACKAGE_ROOT_PATH = process.cwd();
const INPUT_FILE = path.join(PACKAGE_ROOT_PATH, "src/index.ts");
const PKG_JSON = require(path.join(PACKAGE_ROOT_PATH, "package.json"));

const extensions = [".js", ".jsx", ".ts", ".tsx"];

const TYPES_ONLY = process.env.TYPES_ONLY === "true";

const output = [
  {
    file: PKG_JSON.main,
    format: "cjs",
    exports: "named",
    sourcemap: true,
  },
  {
    file: PKG_JSON.module,
    format: "es",
    exports: "named",
    sourcemap: true,
  },
];

const external = [
  ...Object.keys(PKG_JSON.dependencies || {}),
  ...Object.keys(PKG_JSON.devDependencies || {}),
  ...Object.keys(PKG_JSON.peerDependencies || {}),
  "date-fns/locale/fi",
  "date-fns/locale/pl",
  "date-fns/locale/sv",
  "date-fns/locale/en-GB",
  "react-google-autocomplete",
  "react-signature-canvas",
  "@weare/athenaeum-toolkit",
  "@weare/athenaeum-react-common",
  "@weare/athenaeum-react-components",
];

const cssScopedNameGenerator = function (name, filename) {
  const path = require("path");
  const file = path.basename(filename);
  const isModule = file.endsWith(".module.scss");

  if (!isModule)
    throw new Error(
      'SCSS module generation failed (postcss.generateScopedName). Supported only *.module.scss files. Check "rollup.config.js" file.'
    );

  const className = file.split(".module.scss")[0];

  const kebabCaseClassName = className
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();

  return `athenaeum-${kebabCaseClassName}-${name}`;
};

const ttypescriptBuilder = [
  typescript({
    typescript: ttypescript,
    clean: true,
    useTsconfigDeclarationDir: true,
    transformers: [() => ({ before: [tsNameOf] })],
    tsconfigOverride: {
      compilerOptions: {
        sourceMap: true,
        inlineSourceMap: true,
        declaration: true,
        emitDeclarationOnly: true,
      },
    },
  }),
];

const babelBuilder = [babel({ extensions, babelHelpers: "bundled" })];

const builder = TYPES_ONLY ? ttypescriptBuilder : babelBuilder;

export default {
  input: INPUT_FILE,

  external: external,

  output: output,

  plugins: [
    nodeResolve({ extensions }),
    commonJs(),
    image(),
    postcss({
      autoModules: true,
      modules: {
        generateScopedName: cssScopedNameGenerator,
      },
      extract: false,
    }),
  ].concat(builder),
  onwarn(warning, warn) {
    if (
      warning.code === "CIRCULAR_DEPENDENCY" ||
      warning.code === "EMPTY_BUNDLE"
    )
      return;
    warn(warning);
  },
};
