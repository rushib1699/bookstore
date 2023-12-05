import Axios from 'axios';
import React from 'react';
import { FiLogOut, FiSettings } from "react-icons/fi";
import { Link, useHistory} from 'react-router-dom';
import '../res/css/NavBar.css';

function NavBar(props) {
  const apis = require("../Config/API.json");
  const history = useHistory();
  const user = sessionStorage.getItem('user-name')

  const logOut = () => {
    let logoutTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log(logoutTime)
    console.log((((Date.now() - localStorage.getItem('login-time_cal')) /(1000))/60).toFixed(2)) ;

    Axios.post(apis.LOGOUT, {
      
      logInTime : localStorage.getItem('login-time'),
      logOutTime : logoutTime,
      loggedDuration : (((Date.now() - localStorage.getItem('login-time_cal')) /(1000))/60).toFixed(2),
      username : sessionStorage.getItem('user-name'),
      userId : sessionStorage.getItem('user-id')
    }).then((response) => {
    sessionStorage.clear()
    localStorage.clear()
      console.log("user logged out")
      history.push("/");
    })

  }
  return (
    <div className="navbar">
      <h1 id="navbar-text">Account Management Hub</h1>
      {/* <div className="navbar-user">{user}</div>     
      <div className="navbar-setting">
        <Link to="/settings"> <button> <FiSettings  size={35} style={{ color: "white" }}/></button> </Link>
      </div>
      <div className="navbar-logout">
        <button onClick={logOut}> <FiLogOut  size={35} style={{ color: "red" }}/></button>
      </div> */}
    </div>
  )
}

export default NavBar;