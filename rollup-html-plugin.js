const path = require("path");
const fs = require("fs");

function getJsFiles(bundle, injectEntryJs) {
  const files = Object.values(bundle).filter(
    (file) => file.isEntry || (typeof file.type === "string" ? file.type === "asset" : file.isAsset)
  );
  const result = [];
  for (const file of files) {
    const { fileName, isEntry, name } = file;
    if (injectEntryJs && !isEntry) return;

    const extension = path.extname(fileName).substring(1);
    if (extension === "js") {
      result.push([fileName, name]);
    }
  }

  return result;
}

function makeAttributes(attributes) {
  const keys = Object.keys(attributes);
  if (!attributes || !keys || !keys.length) return "";

  return keys.reduce((result, key) => (result += ` ${key}="${attributes[key]}"`), "");
}

function getScriptTag(fileName, dir, format, scriptAttrs) {
  const attrs = { ...scriptAttrs };

  if (format === "esm" || format === "es") {
    attrs.type = "module";
  }
  return `<script src="${dir ? dir + "/" : ""}${fileName}${makeAttributes(attrs)}"></script>`;
}

function getScripts(files, dir, format, scriptAttrs) {
  return files.map(([fileName, name]) => getScriptTag(fileName, dir, format, scriptAttrs[name]));
}

function injectScripts(inputSource, scriptTags) {
  return inputSource.replace("{%js_scripts%}", scriptTags.join("\n"));
}

function getHtmlFileSource(input) {
  const fileName = path.resolve(__dirname, input);
  try {
    if (!fs.existsSync(fileName)) return [null, `File: ${fileName}, does not exists.`];
    const templateStr = fs.readFileSync(fileName).toString("utf8");
    return [templateStr, null];
  } catch (error) {
    return [null, `Error occurred while reading file: ${fileName}. Error: ${error}`];
  }
}

function writeFile(fileName, source) {
  try {
    const targetDir = path.dirname(fileName);
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(fileName, source, "utf8");
    console.log(`Created file: ${fileName}`);
  } catch (error) {
    console.error(`Error occurred while writing file: ${fileName}. Error: ${error}`);
  }
}

function getLiveReloadingScript() {
  return `
    <script>
      const host = (location.host || "localhost").split(":")[0];
      const script = document.createElement("script");
      script.src = 'http://' + host + ':35729/livereload.js?snipver=1';
      document.head.appendChild(script);
    </script>
  `;
}

const supportedFormats = ["es", "esm", "iife", "umd"];

const defaults = {
  input: "src/index.html",
  output: "public/index.html",
  injectEntryJs: true,
  servePath: "/",
  injectLiveReloadScript: false,
  scriptAttrs: {},
};

function html(opts = {}) {
  const {
    output,
    input,
    injectEntryJs,
    scriptAttrs,
    publicDirName,
    servePath,
    injectLiveReloadScript,
  } = {
    ...defaults,
    ...opts,
  };

  return {
    name: "html",

    async generateBundle(outputParams, bundle) {
      if (!supportedFormats.includes(outputParams.format) && !opts.template) {
        this.warn(
          `plugin-html: The output format '${
            outputParams.format
          }' is not supported. Supported formats include: ${supportedFormats.join(", ")}`
        );
      }

      const [inputSource, error] = getHtmlFileSource(input);
      if (error !== null) {
        this.error(error);
      }

      const fileName = path.resolve(__dirname, output);
      if (!outputParams.dir && !publicDirName) {
        this.error("Please specify the publicDirName");
      }
      const outputDir = `${servePath}${publicDirName || outputParams.dir}`;
      const files = getJsFiles(bundle, injectEntryJs);
      const scripts = getScripts(files, outputDir, outputParams.format, scriptAttrs);
      if (injectLiveReloadScript) {
        scripts.push(getLiveReloadingScript());
      }
      const source = injectScripts(inputSource, scripts);
      writeFile(fileName, source);
    },
  };
}

export default html;
