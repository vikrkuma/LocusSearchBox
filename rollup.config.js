import typescript from "rollup-plugin-typescript2";
import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss-modules";
import autoprefixer from "autoprefixer";
import { terser } from "rollup-plugin-terser";
import HtmlPlugin from "./rollup-html-plugin";
import Image from "@rollup/plugin-image";

const ENVS = {
  PRODUCTION: "production",
  DEVELOPMENT: "development",
};

const environment = process.env.APP_ENV || ENVS.DEVELOPMENT;
const isProduction = environment === ENVS.PRODUCTION;
const IS_DEV = environment === ENVS.DEVELOPMENT;
const outputPartialClient = isProduction
  ? {
      dir: "public",
      entryFileNames: "app.[hash].js",
      plugins: [terser()],
    }
  : {
      file: "./public/app.js",
      sourcemap: "true",
    };
const outputPartialServer = isProduction
  ? {
      plugins: [terser()],
    }
  : {
      sourcemap: "true",
    };

export default [
  {
    input: "./src/client/index.tsx",
    output: {
      format: "iife",
      ...outputPartialClient,
    },
    plugins: [
      commonjs(),
      resolve(),
      replace({
        "process.env.NODE_ENV": isProduction ? `'${ENVS.PRODUCTION}'` : `'${ENVS.DEVELOPMENT}'`,
        IS_DEV,
      }),
      postcss({
        modules: true,
        extensions: [".css", ".scss"],
        minimize: isProduction,
        writeDefinitions: true,
        sourceMap: IS_DEV,
        plugins: [
          autoprefixer({
            env: isProduction ? ENVS.PRODUCTION : ENVS.DEVELOPMENT,
            add: true,
            remove: true,
          }),
        ],
      }),

      typescript({
        clean: true,
        rollupCommonJSResolveHack: true,
      }),
      HtmlPlugin({
        input: "src/client/index.html",
        publicDirName: "public",
        injectLiveReloadScript: IS_DEV,
      }),
      Image(),
    ],
    watch: {
      include: "./src/client/*",
      clearScreen: false,
      exclude: ["node_modules", "dist", "public"],
    },
  },
  {
    input: "./src/server/index.ts",
    external: ["express"],
    output: {
      file: "./dist/server.js",
      format: "cjs",
      ...outputPartialServer,
    },
    plugins: [
      replace({ IS_DEV }),
      typescript({
        clean: true,
        rollupCommonJSResolveHack: true,
      }),
    ],
    watch: {
      include: "./src/server/*",
      clearScreen: false,
      exclude: ["node_modules", "dist", "public"],
    },
  },
];
