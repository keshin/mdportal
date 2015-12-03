import documentConfig from "document.config"
import React from "react"
import ReactDOM from "react-dom"
import {Link, History} from "react-router"
import "bootstrap/dist/css/bootstrap.min.css"
import util from "./utils"

export const App = React.createClass({
  render() {
    return (<div>
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <Link to="/" className="navbar-brand">{documentConfig.name} <small>{documentConfig.latestVersion}</small></Link>
          </div>
          <div className="collapse navbar-collapse">
            <ul className="nav navbar-nav navbar-right">
              <li><Link to="/docs" query={{path: `${documentConfig.path}/${documentConfig.versions[0]}/README.md`}}>
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
      </div>
    );
  }
});


export const MdComponent = React.createClass({
  mixins: [History],
  getInitialState() {
    return {doc: "", version: "", base: documentConfig.path, rest: ""}
  },
  handleChange(location) {
    let path = location.query && location.query.path;
    if (path) {
      util.getDocument(path).done(doc => {
        if (this.isMounted()) {
          let {version, base, rest} = util.getDocMeta(path);
          this.setState({doc, version, base, rest});
        }
      });
    } else {
      this.history.push("/");
    }
  },
  componentDidMount() {
    this.handleChange(this.props.location);
  },
  componentWillReceiveProps(nextProps) {
    this.handleChange(nextProps.location);
  },
  switchVersion(e) {
    let version = e.target.value;
    if (version !== this.state.version) {
      let {base, rest} = this.state;
      this.history.pushState(null, "/docs", {path: `${base}/${version}${rest}`});
    }
  },
  render() {
    return (<div className="container" >
      <div className="row">
        <div className="col-lg-3 pull-right">
          <select onChange={this.switchVersion} value={this.state.version}>{
            documentConfig.versions.map(version => {
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


