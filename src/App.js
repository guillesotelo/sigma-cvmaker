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

function App() {
  return (
    <Switch>
      <Route path="/login">
        <Header/>
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
      <Route path="/createResume">
        <Header/>
        <NewResume/>
      </Route>
    </Switch>
  )
}

export default App;
