/// Components import
import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";



/// Stylesheet import 

import './App.css';

/// Pages import

import Home from "./Pages/home.js";
import Login from "./Pages/login.js";
import Leaderboard from "./Pages/leaderboard.js";



class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/leaderboard" component={Leaderboard} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
