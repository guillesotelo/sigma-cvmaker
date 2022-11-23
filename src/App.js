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
import Footer from "./components/Footer";
import Account from "./pages/Account";
import Settings from "./pages/Settings";

function App() {
  return (
    <Switch>
      <Route path="/login">
        <Login />
        <Footer />
      </Route>
      <Route path="/register">
        <Header />
        <Register />
        <Footer />
      </Route>
      <Route exact path="/">
        <Header />
        <Home />
        <Footer />
      </Route>
      <Route path="/myResumes">
        <Header />
        <MyResumes />
        <Footer />
      </Route>
      <Route path="/allResumes">
        <Header />
        <MyResumes showAll={true} />
        <Footer />
      </Route>
      <Route path="/createResume">
        <Header />
        <NewResume />
      </Route>
      <Route path="/report">
        <Header />
        <Report />
        <Footer />
      </Route>
      <Route path="/account">
        <Header />
        <Account />
        <Footer />
      </Route>
      <Route path="/settings">
        <Header />
        <Settings />
        <Footer />
      </Route>
      <Route>
        <Header />
        <Home />
        <Footer />
      </Route>
    </Switch>
  )
}

export default App;
