import config from "./config"
import React from "react"
import ReactDOM from "react-dom"
import {Link, History} from "react-router"
import "bootstrap/dist/css/bootstrap.min.css"
import util from "./utils"
import $ from "jquery"
import scrollTo from "jquery.scrollto"

export const App = React.createClass({
  render() {
    return (<div>
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <Link to="/" className="navbar-brand">{config.name} <small>{config.latestVersion}</small></Link>
          </div>
          <div className="collapse navbar-collapse">
            <ul className="nav navbar-nav navbar-right">
              <li><Link to={`/docs/${config.repo}/${config.versions[0]}/README.md`}>
                <span className="glyphicon glyphicon-menu-hamburger"></span>
                Document</Link></li>
            </ul>
          </div>
        </div>
      </nav>
      {this.props.children}
    </div>);
  }
});

export const AppHome = React.createClass({
  render() {
    return (
      <div className="container">
        <h1>Squbs</h1>
        <p>I'm the dummy home page, Find and update me in src/main.js#AppHome</p>
        <Link to={`/docs/${config.repo}/${config.versions[0]}/README.md`}>
          Check the document of squbs
        </Link>
      </div>
    );
  }
});


export const MdComponent = React.createClass({
  mixins: [History],
  getInitialState() {
    return {doc: "", version: "", repo: config.repo, rest: ""}
  },
  handleChange(props) {
    let path = props.params.splat.join("/") + ".md";
    if (path) {
      util.getDocument(path).done(doc => {
        if (this.isMounted()) {
          let {version, repo, rest} = util.getDocMeta(path);
          this.setState({doc, version, repo, rest});
        }
      }).progress(progress => {
        console.log(progress);
      });
    } else {
      this.history.push("/");
    }
  },
  componentDidMount() {
    this.handleChange(this.props);
  },
  componentWillReceiveProps(nextProps) {
    this.handleChange(nextProps);
  },
  componentDidUpdate() {
    let hash = this.props.location.query.hash;
    let target = 0; // top
    if (hash) {
      target = document.getElementById(hash) || 0;
    }
    $(window).scrollTo(target, 300);
  },
  switchVersion(e) {
    let version = e.target.value;
    if (version !== this.state.version) {
      let {repo, rest} = this.state;
      this.history.pushState(null, `/docs/${repo}/${version}${rest}`);
    }
  },
  render() {
    return (<div className="container" >
      <div className="row">
        <div className="col-lg-9">

        </div>
        <div className="col-lg-3">
          <select onChange={this.switchVersion} value={this.state.version}>{
            config.versions.map(version => {
              return (
                <option key={version} value={version}>{version}</option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12" dangerouslySetInnerHTML={{__html: this.state.doc}}></div>
      </div>
    </div>);
  }
});


