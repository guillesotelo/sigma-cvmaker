import "./App.css";
import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import './pages/styles/index.css'
import 'react-toastify/dist/ReactToastify.css';
import MyResumes from "./pages/MyResumes";
import NewResume from "./pages/NewResume";
import Report from "./pages/Report.js";

function App() {
  return (
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/register">
        <Header/>
        <Register />
      </Route>
      <Route exact path="/">
        <Header/>
        <Home />
      </Route>
      <Route path="/myResumes">
        <Header/>
        <MyResumes/>
      </Route>
      <Route path="/allResumes">
        <Header/>
        <MyResumes showAll={true}/>
      </Route>
      <Route path="/createResume">
        <Header/>
        <NewResume/>
      </Route>
      <Route path="/report">
        <Header/>
        <Report/>
      </Route>
      <Route>
        <Header/>
        <Home/>
      </Route>
    </Switch>
  )
}

export default App;
