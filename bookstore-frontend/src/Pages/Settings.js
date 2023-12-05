import { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom'

import NavBar from '../Components/NavBar'
import SideNavBar from '../Components/SideNavBar'
import Axios from 'axios'

import './../res/css/Settings.css'
function Settings() {
    const apis = require("../Config/API.json");
    const [contact, setContact] = useState();
    const [email, setEmail] = useState();
    const [team, setTeam] = useState();
    useEffect(() => {
        const Access_token = sessionStorage.getItem('token')

        const config = {
            headers: {
                'Authorization': `Bearer ${Access_token}`
            },
            params: {
                id: sessionStorage.getItem('user-id')
            }
        }

        
        Axios.get(apis.USER_FETCH, config).then((response) => {
            if (response.data.message) {
                console.log(response.data.message)
                //setLoginError(response.data.message)
            }
            else {
                setContact(response.data.result[0].contact)
                setEmail(response.data.result[0].email)
                setTeam(response.data.result[0].team_name)
                //console.log(response.data.result[0])
            }
        }).catch((error) => {
            console.log(error)
        })
    })

    if (!(sessionStorage.getItem('login-status'))) {
        console.log("here")
        return <Redirect to='/' />
    }

    return (
        <div>
            <NavBar />
            <SideNavBar />
            <div className='settings-box'>
                <h1>Settings</h1>
                <ul>
                    <li></li>
                    <li>Contact: {contact}</li> <br></br>
                    <li>Email: {email}</li> <br></br>
                    <li>Team: {team}</li><br></br>
                    <li>
                        <Link to="/resetPassword">Reset Password</Link>
                    </li>
                </ul>
            </div>

        </div>
    )
}

export default Settings