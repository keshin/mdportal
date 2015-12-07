import marked from "marked"
import $ from "jquery"
import documentConfig from "document.config"
import URI from "urijs"
import history from "./history"

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
        let query = {path: uri.fragment("").toString()};
        if (hash) {
          query.hash = hash;
        }
        href = history.createHref("/docs", query);
      } else {
        href = uri.toString();
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
    return $.get(url).then(text => {
      return marked(text, {renderer: getRender(url), pedantic: true});
    })
  },
  getDocMeta(url) {
    if (url.startsWith(documentConfig.path)) {
      let base = documentConfig.path;
      let rest = url.replace(base, "");
      let [, version, path] = pathPattern.exec(rest);
      return {
        base, version, rest: path
      };
    } else {
      return {};
    }
  }
};
