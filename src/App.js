import "./App.css";
import React from "react";
import { Switch, Route } from "react-router-dom";
import './pages/styles/index.css'
import 'react-toastify/dist/ReactToastify.css';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import CVs from "./pages/CVs";
import NewCV from "./pages/NewCV";
import Report from "./pages/Report";
import Footer from "./components/Footer";
import Account from "./pages/Account";
import Settings from "./pages/Settings";
import SdideBar from "./components/SideBar";
import Users from "./pages/Users";
import Activity from "./pages/Activity";
import Help from "./pages/Help";
import ToolsTech from "./pages/ToolsTech";
import Clients from "./pages/Clients";
import Consultants from "./pages/Consultants";
import Statistics from "./pages/Statistics";
import Search from "./pages/Search";

function App() {
  return (
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/register">
        <div className="root-container">
          <SdideBar />
          <div className="root-column">
            <Register />
            <Footer />
          </div>
        </div>
      </Route>
      <Route exact path="/">
        <Header />
        <div className="root-container">
          <SdideBar />
          <div className="root-column">
            <Home />
            <Footer />
          </div>
        </div>
      </Route>
      <Route path="/my-cvs">
        <Header />
        <div className="root-container">
          <SdideBar />
          <div className="root-column">
            <CVs />
            <Footer />
          </div>
        </div>
      </Route>
      <Route path="/cvs">
        <Header />
        <div className="root-container">
          <SdideBar />
          <div className="root-column">
            <CVs showAll={true} />
            <Footer />
          </div>
        </div>
      </Route>
      <Route path="/new-cv">
        <Header />
        <div className="root-container">
          <SdideBar />
          <div className="root-column">
            <NewCV />
            <Footer />
          </div>
        </div>
      </Route>
      <Route path="/new-cv:edit">
        <Header />
        <div className="root-container">
          <SdideBar />
          <div className="root-column">
            <NewCV />
            <Footer />
          </div>
        </div>
      </Route>
      <Route path="/elastic">
        <Header />
        <div className="root-container">
          <SdideBar />
          <div className="root-column">
            <Search />
            <Footer />
          </div>
        </div>
      </Route>
      <Route path="/elastic:search">
        <Header />
        <div className="root-container">
          <SdideBar />
          <div className="root-column">
            <Search />
            <Footer />
          </div>
        </div>
      </Route>
      <Route path="/report">
        <Header />
        <div className="root-container">
          <SdideBar />
          <div className="root-column">
            <Report />
            <Footer />
          </div>
        </div>
      </Route>
      <Route path="/account">
        <Header />
        <div className="root-container">
          <SdideBar />
          <div className="root-column">
            <Account />
            <Footer />
          </div>
        </div>
      </Route>
      <Route path="/consultants">
        <Header />
        <div className="root-container">
          <SdideBar />
          <div className="root-column">
            <Consultants />
            <Footer />
          </div>
        </div>
      </Route>
      <Route path="/clients">
        <Header />
        <div className="root-container">
          <SdideBar />
          <div className="root-column">
            <Clients />
            <Footer />
          </div>
        </div>
      </Route>
      <Route path="/tools-and-tech">
        <Header />
        <div className="root-container">
          <SdideBar />
          <div className="root-column">
            <ToolsTech />
            <Footer />
          </div>
        </div>
      </Route>
      <Route path="/activity">
        <Header />
        <div className="root-container">
          <SdideBar />
          <div className="root-column">
            <Activity />
            <Footer />
          </div>
        </div>
      </Route>
      <Route path="/statistics">
        <Header />
        <div className="root-container">
          <SdideBar />
          <div className="root-column">
            <Statistics />
            <Footer />
          </div>
        </div>
      </Route>
      <Route path="/users">
        <Header />
        <div className="root-container">
          <SdideBar />
          <div className="root-column">
            <Users />
            <Footer />
          </div>
        </div>
      </Route>
      <Route path="/settings">
        <Header />
        <div className="root-container">
          <SdideBar />
          <div className="root-column">
            <Settings />
            <Footer />
          </div>
        </div>
      </Route>
      <Route path="/help">
        <Header />
        <div className="root-container">
          <SdideBar />
          <div className="root-column">
            <Help />
            <Footer />
          </div>
        </div>
      </Route>
      <Route>
        <Header />
        <div className="root-container">
          <SdideBar />
          <div className="root-column">
            <Home />
            <Footer />
          </div>
        </div>
      </Route>
    </Switch>
  )
}

export default App;
