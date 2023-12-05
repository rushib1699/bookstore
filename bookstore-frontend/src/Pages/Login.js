import './../res/css/Login.css';
import { useState } from 'react';
import Axios from 'axios';
import smartservLogo from './../res/img/smartserv-logo-with-name.png';
import { useHistory } from 'react-router-dom';
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { firebase, auth } from '../Config/firebaseauth';

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const history = useHistory();
  const apis = require("../Config/API.json");


  const [phoneNumber, setPhoneNumber] = useState("");
  const [final, setfinal] = useState('');
  const [show, setshow] = useState(false);
  const [otp, setotp] = useState('');


  const signin = () => {

    if (phoneNumber === "" || phoneNumber.length < 10) return;

    let verify = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    auth.signInWithPhoneNumber(phoneNumber, verify).then((result) => {
      setfinal(result);
      alert("code sent")
      setshow(true);
    })
      .catch((err) => {
        alert(err);
        // window.location.reload()
      });
  }

  // Validate OTP
  const ValidateOtp = () => {
    if (otp === null || final === null)
      return;
    final.confirm(otp).then((result) => {
      sessionStorage.setItem('user-phonenumber', result.user.multiFactor.user.phoneNumber)
      checkLogin()
    }).catch((err) => {
      alert("Wrong code");
    })
  }

  Axios.defaults.withCredentials = true;
  const checkLogin = () => {
    if ((username !== "") && (password !== "")) {
      Axios.post('http://localhost:3008/login', {
        username: username,
        pass: password,
      }).then((response) => {
        if (response.data.message) {
          setLoginError(response.data.message)
        }
        else {
          sessionStorage.setItem('user-name', response.data.result[0].Username)
          sessionStorage.setItem('user-id', response.data.result[0].UserID)
          sessionStorage.setItem('login-status', response.data.isLoggedIn)
          sessionStorage.setItem('role', response.data.result[0].RoleID)
          sessionStorage.setItem('token', response.data.token)
          history.push({
            pathname: '/home'
          })
          //console.log(response.data[0].firstName)
        }
      }).catch((error) => {
        console.log(error)
      })
      console.log("in try")
    }
  }

  /* useEffect(() => {
    Axios.get(apis.LOGIN).then((response) => {
      //console.log(response)
      if ( !response.data.isLoggedIn) {

      }
      else {
          sessionStorage.setItem('user-name', response.data.result[0].firstName)
          sessionStorage.setItem('user-id', response.data.result[0].id)
          sessionStorage.setItem('login-status', response.data.isLoggedIn)
          sessionStorage.setItem('token', response.data.token)
        history.push({
          pathname: '/home'
        })
        //console.log(response.data[0].firstName)
      }
    }) 
  }, []) */

  return (
    <div className="App">
      <main role="main" className="main">

        <header className="heading">
          {/* <img id="logowithname" src={smartservLogo} alt="SmartServ" />
          <p style={{
            border: "1px solid black",
            width: "100%"
          }} /> */}
          <label id="cs-heading">BookStore and Rental</label>
        </header>


        <section className="login">
          <br />
          <label> Welcome! </label>
          <br /><br /><br />
          <div className="login-error">
            {loginError}
          </div>
          <br />
          <form>
            <input type="text" placeholder="EMAIL" required
              onChange={(event) => {
                setUsername(event.target.value)
              }}
            />
            <br /><br />
            <input type="password" placeholder="PASSWORD" required
              onChange={(event) => {
                setPassword(event.target.value)
              }}
            />
             <br /><br />
            <div style={{ display: !show ? "block" : "none" }}>
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="PHONE NUMBER"
              />
              <br /><br />
              <div id="recaptcha-container"></div>
              <button type="button" onClick={signin}>Send OTP</button>
            </div>
            <div style={{ display: show ? "block" : "none" }}>
              <input
                type="text"
                placeholder="Enter your OTP"
                onChange={(e) => setotp(e.target.value)}
              />
              <br /><br />
              <button type="button" onClick={ValidateOtp}>Verify</button>
            </div>
            <br /><br /><br />
            {/* <input
              type="button"
              value="LOGIN"
              onClick={checkLogin}
            //onClick={() => {checkLogin}}
            /> */}
          </form>
        </section>


      </main>
    </div>
  );
}
export default Login;



