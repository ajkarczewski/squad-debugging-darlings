import { useState, useEffect } from "react";
import "../CSS/SignupModal.css";
import { LoginModal } from "./LoginModal";
import { Link, useNavigate, Navigate } from 'react-router-dom'
import Nav from "./Nav";
import { Alert } from "@mui/material";


export const SignupModal = () => {
  const baseURL = "http://localhost:3000";
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [validEmail, setValidEmail] = useState(true);
  const [passwordError, setPasswordError] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const navigate = useNavigate();

  const validatePassword = (value) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    setPasswordError(!passwordRegex.test(value));
  };

  const validateEmail = (value) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    setValidEmail(emailRegex.test(value));
  }

  useEffect(() => {
    if (validEmail && !passwordError) {
      setIsButtonDisabled(false);
    }
  }, [email, password, passwordConfirm]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
        password_confirm: passwordConfirm,
      }),
    };

    fetch(`${baseURL}/auth/signup`, requestOptions)
      .then(res => {
        if (res.ok) {
          // return <Navigate replace to='/login' alertMsg={"Success"} setAlertMsg={setAlertMsg}/>
          navigate('/login', { state: { alertMsg: "Account successfully created!", setAlertMsg: { setAlertMsg }, emailLogin: { email } } });
        }
        else return res.json();
      }
      )
      .then(data => {
        console.log(data.message)
        if (data.message === 'Email already exists') {
          const msg = data.message
          navigate('/login', { state: { alertMsg: msg, setAlertMsg: { setAlertMsg }, emailLogin: { email } } });
        }
        else setAlertMsg(data.message);

      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <>
      <Nav />
      <div className="signup-container">
        <div className="signup-content">
          <div className="signup-title">
            <h1>Get Started with Cherry on Tech!</h1>
            <p>Register with your email</p>
          </div>
          <form className="form" onSubmit={handleSubmit}>
            {alertMsg ? <Alert severity="error">{alertMsg}</Alert> : <></>}
            <label>Email</label>
            <input
              type="email"
              value={email}
              placeholder="info@cherry.com"
              onChange={(e) => setEmail(e.target.value)}
              onInput={(e) => validateEmail(e.target.value)}
            />
            {!validEmail && (
              <p className="error-message">This value is not a valid email.</p>
            )}
            <label>Password</label>
            <input
              type="password"
              value={password}
              placeholder="your password"
              onChange={(e) => setPassword(e.target.value)}
              onInput={(e) => validatePassword(e.target.value)}
            />
            <div className="yes-error">
              <p className={passwordError && password ? "error-message" : "i"}>
                <span>&#9432;</span>At least 8 characters and a mix of numbers.
              </p>
              <p className={passwordError && password ? "error-message" : "i"}>
                <span>&#9432;</span>Must contain Upper & Lower case letters.
              </p>
              <p className={passwordError && password ? "error-message" : "i"}>
                <span>&#9432;</span>No symbols.
              </p>
            </div>

            <br />
            <label>Confirm Password</label>
            <input
              type="password"
              value={passwordConfirm}
              placeholder="your password"
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
            <br />
            <button
              disabled={isButtonDisabled}
              className={
                isButtonDisabled
                  ? "signup-button-disabled"
                  : "signup-button-enabled"
              }
              type="submit"
            >
              Register Account
            </button>
          </form>
          <div className="login-account">
            <p>Already have an account?</p>
            <Link className="log-in-button" to="/login">Log In</Link>
          </div>
        </div>
      </div>
    </>
  );
};
