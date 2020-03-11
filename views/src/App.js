import React from 'react';
import './App.css';
import NavigationBar from '../src/components/NavigationBar';
import Dashboard from '../src/layouts/Dashboard';
import Project from '../src/layouts/Project';
import Researcher from '../src/layouts/Researcher';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <NavigationBar></NavigationBar>
        <Switch>
          <Route path="/project">
            <Project />
          </Route>
          <Route path="/researcher">
            <Researcher />
          </Route>
          <Route path="/">
            <Dashboard />
          </Route>
        </Switch>
        {/* <TotalContents></TotalContents>
        <MainContents></MainContents> */}
      </div>
    </Router>
  );
}

export default App;
