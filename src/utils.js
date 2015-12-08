import marked from "marked"
import $ from "jquery"
import config from "./config"
import URI from "urijs"
import history from "./history"
import highlight from "highlight.js"
import "highlight.js/styles/default.css"

function getRender(base) {
  let render = new marked.Renderer();
  render.link = function(href, title, text) {
    let uri = new URI(href);
    let isAbsolute = uri.is("absolute");
    let isMd = uri.suffix()  === "md";
    title = title ? `title="${title}"` : "";
    let others = "";
    if (isAbsolute) {
      others = 'target="_blank"';
    } else {
      uri = uri.absoluteTo(base);

      if (isMd) {
        let hash = uri.fragment();
        let query = hash && {hash};
        let path = uri.fragment("").path();
        href = history.createHref(`/docs${path}`, query);
      } else {
        href = uri.absoluteTo(config.base).toString();
      }
    }
    return `<a href="${href}" ${title} ${others} >${text}</a>`;
  };
  render.image = function(href, title, text) {
    title = title ? `title="${title}"` : "";
    href = new URI(href, base);
    return `<img src="${href}" alt="${text}" ${title} />`
  };
  return render;
}

let pathPattern = /\/?([^/]+)(.*)/;

export default {
  getDocument(url) {
    let base = `${config.rawBase}/${url}`;
    return $.get(base).then(text => {
      return marked(text, {renderer: getRender(base), highlight: (code, lang) => {
        let detected = highlight.getLanguage(lang);
        if (detected) {
          return highlight.highlight(detected, code).value;
        } else {
          return code;
        }
      }});
    })
  },
  getDocMeta(url) {
    if (url.startsWith(config.path)) {
      let repo = config.repo;
      let rest = url.replace(repo, "");
      let [, version, path] = pathPattern.exec(rest);
      return {
        repo, version, rest: path
      };
    } else {
      return {};
    }
  }
};
