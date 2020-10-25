import React from 'react';
import './App.css';
import Login from './components/Login/Login.js';
import {Route} from 'react-router-dom';
import Register from './components/Register/Register.js';
import Dashboard from "./components/Dashboard/Dashboard.js";

function App() {
  return (
    <div className="App">
      <Route exact path ='/login' component = {Login}/>
      <Route exact path = '/' component = {Register}/>
      <Route exact path = '/in' component = {Dashboard}/> 
    </div>
  );
}

export default App;
