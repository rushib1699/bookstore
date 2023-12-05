import Axios from 'axios';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import NavBar from '../Components/NavBar'
import SideNavBar from '../Components/SideNavBar'
import './../res/css/ResetPassword.css'
import smartserv from './../res/img/smartserv.jpg';
import {Redirect} from 'react-router-dom'; 

function ResetPassword() {
    const apis = require("../Config/API.json");
    const [newPassword, setNewPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const [err, setErr] = useState("");

    const history = useHistory();

    const Access_token = sessionStorage.getItem("token")

    if(! (sessionStorage.getItem('login-status'))) {
        console.log("here")
        return <Redirect to='/' />
        }

    const checkReset = () => {
        if ((newPassword !== "") && (confPassword !== "")) {
            if (newPassword !== confPassword) {
                setErr("Password Mismatch")
            }
            else if (newPassword.length < 8) {
                setErr("Password Length Should be more than 8 characters")
            }
            else {
                Axios.post(apis.PASS_CHANGE, {
                    user: sessionStorage.getItem("user-id"),
                    pass: newPassword
                }, {
                    headers: {
                        'Authorization' : `Bearer ${Access_token}`
                    }
                }).then((response) => {
                    if (response.data.message == "updated") {
                        setErr("")
                        alert("Password Changed")
                        history.push({
                            pathname: '/home'
                        })
                    }
                    else {
                        setErr("Could not Change Password")
                    }
                })

            }
        }
    }

    return (
        <div>
            <NavBar />
            <SideNavBar />
            <div class="container">
                <img className="logo" src={smartserv} alt="SmartServ" />
                <br />
                <header>RESET PASSWORD</header>
                <br />
                <form action="#">
                    <div class="error-text">{err}</div>
                    <br /><br />
                    <div class="field-entry">
                        <a>New Password*</a>
                        <input type="password" placeholder="Enter New Password" required
                            onChange={(event) => {
                                setNewPassword(event.target.value)
                            }} />

                    </div>
                    <br /><br />
                    <div class="field-entry">
                        <a>Confirm Password*</a>
                        <input type="password" placeholder="Confirm Password" required
                            onChange={(event) => {
                                setConfPassword(event.target.value)
                            }} />
                    </div>
                    <br />
                    <button onClick={checkReset}>Submit</button>
                </form>
            </div>
        </div>
    )
}
export default ResetPassword 