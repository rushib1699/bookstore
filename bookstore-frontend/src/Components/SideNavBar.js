import React from 'react';
import '../res/css/SideNavBar.css';
import logoWithName from './../res/img/smartserv-logo-with-name.png';
import { SideNavBarData } from './SideNavBarData';
import { Link, NavLink } from "react-router-dom";
import { AiFillHome, AiFillSetting } from 'react-icons/ai';
import { IoDocuments, IoLinkSharp } from 'react-icons/io5';
import { FaClipboardList } from 'react-icons/fa';
import { RiTeamFill } from 'react-icons/ri';
import { CgLogOut } from 'react-icons/cg';
import { HiSpeakerphone } from 'react-icons/hi';
import { BsArrowRepeat } from 'react-icons/bs';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import usericon from './../res/img/user-icon.png';



function SideNavBar() {
  const apis = require("../Config/API.json");
  const history = useHistory();
  const user = sessionStorage.getItem('user-name')
  const logOut = () => {
    let logoutTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log(logoutTime)
    console.log((((Date.now() - localStorage.getItem('login-time_cal')) / (1000)) / 60).toFixed(2));

    Axios.post(apis.LOGOUT, {

      logInTime: localStorage.getItem('login-time'),
      logOutTime: logoutTime,
      loggedDuration: (((Date.now() - localStorage.getItem('login-time_cal')) / (1000)) / 60).toFixed(2),
      username: sessionStorage.getItem('user-name'),
      userId: sessionStorage.getItem('user-id')
    }).then((response) => {
      sessionStorage.clear()
      localStorage.clear()
      console.log("user logged out")
      history.push("/");
    })
  }

  return (
    <nav className="sidenavbar">

      {/* <img id="logoWithName" src={logoWithName} alt="SmartServ" /> */}

      <section className="profile">
        <img id="profile-icon" src={usericon} />
        <p id="username">{user}</p>
        <div className='sett-logout'>
          <NavLink id="settings" to="/settings"><AiFillSetting /></NavLink>
          <button onClick={logOut} id="logout"><CgLogOut /></button>
        </div>
      </section>

      <p id="divider"></p>

      <ul className="sidebarlist">
        
        <li>
          <NavLink className="navLink" to="/home"
            exact activeStyle={{ backgroundColor: "rgb(119, 191, 67)", boxShadow: "none"}}>
            <AiFillHome className='icons' />
            Home
          </NavLink>
        </li>

        {/* <li>
          <NavLink className="navLink" to="/docs"
            exact activeStyle={{backgroundColor: "rgb(119, 191, 67)", boxShadow: "none"}}>
            <IoDocuments className="icons" />
            Documents
          </NavLink>
        </li> */}
        <br></br>
        <li>
          <NavLink className="navLink" to="/links"
            exact activeStyle={{ backgroundColor: "rgb(119, 191, 67)", boxShadow: "none" }}>
            <IoLinkSharp className='icons' />
            Cart
          </NavLink>
        </li>
        <br></br>
        <li>
          <NavLink className="navLink" to="/activity"
            exact activeStyle={{ backgroundColor: "rgb(119, 191, 67)", boxShadow: "none" }}>
            <FaClipboardList className='icons' />
            Purchase 
            History
          </NavLink>
        </li>
    <br></br>
         <li>
          <NavLink className="navLink" to="/uploadBook"
            exact activeStyle={{ backgroundColor: "rgb(119, 191, 67)", boxShadow: "none" }}>
            <RiTeamFill className="icons" />
            Add Book
          </NavLink>
        </li>

       {/* <li>
          <NavLink className="navLink" to="/marketingservices"
            exact activeStyle={{ backgroundColor: "rgb(119, 191, 67)", boxShadow: "none" }}>
            <HiSpeakerphone className='icons' />
            <span className="" >Marketing</span>
          </NavLink>
        </li>

        <li>
          <NavLink className="navLink" to="/allrenewals"
            exact activeStyle={{ backgroundColor: "rgb(119, 191, 67)", boxShadow: "none" }}>
            <BsArrowRepeat className='icons' />
            <span className="" >Renewals</span>
          </NavLink>
        </li>*/}
      </ul> 

    </nav>
  )
}


export default SideNavBar;