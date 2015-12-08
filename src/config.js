import documentConfig from "document.config"

let defaultConfig = {
  base: "https://github.com",
  rawBase: "https://raw.githubusercontent.com"
};

export default Object.assign({}, defaultConfig, documentConfig);