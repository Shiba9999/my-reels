import React, { useContext, useEffect } from 'react'
import { Switch, Route, BrowserRouter as Router, Redirect, Link } from "react-router-dom"
import Feed from './components/Feed'
import Login from './components/Login'
import Signup from './components/Signup';
import Profile from './components/Profile';
import logo from './logo.svg';
import './App.css';

function PrivateRoute(props) {
  const authenticatedtoken = localStorage.getItem("isSignin");
  return authenticatedtoken ? <Route {...props}></Route> : <Redirect to="/login"></Redirect>
}

function App() {
  return (
    
      <Router>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <PrivateRoute exact path="/" component={Feed} />
          <PrivateRoute path="/profile" component={Profile} />



        </Switch>

      </Router>




    
  );
}

export default App;
