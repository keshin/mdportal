import React from "react"
import ReactDOM from "react-dom"
import {Router, Route, IndexRoute} from "react-router"
import history from "./history"
import {App, AppHome, MdComponent} from "./Components.jsx"
import "./style.css"

ReactDOM.render((
  <Router history={history}>
    <Route path="/" component={App} >
      <IndexRoute component={AppHome} />
      <Route path="docs/**/*.md" component={MdComponent} />
    </Route>
  </Router>
), document.getElementById("app"));