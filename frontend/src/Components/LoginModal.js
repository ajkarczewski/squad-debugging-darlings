import "../CSS/LoginModal.css";
import { useState, useEffect } from "react";
import {Alert } from "@mui/material";
import Nav from "./Nav";
import { AlertSeverity } from "../constants/AlertSeverity";
import { Link, useLocation } from "react-router-dom";

export const LoginModal = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const { state } = useLocation();
  const { emailLogin, alertMsg, setAlertMsg } = state;
  useEffect(() => {
    const isValid = email && password;
    console.log(isValid);
    setIsButtonDisabled(!isValid);
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    };
    fetch("http://localhost:3000/auth/signin", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAlertMsg(data.message);
      })
      .catch((error) => console.log(error));
  };
  console.log({ emailLogin, alertMsg });
  return (
    <>
      <Nav />
      <div className="modal">
        <div className="modal-content-login">
          <div className="title-login">
            <h1>Welcome back to Cherry on Tech!</h1>
            <p>Log in with your email</p>
            {alertMsg != "" ? (
              <Alert severity={AlertSeverity[alertMsg]}>{alertMsg}</Alert>
            ) : (
              <></>
            )}
          </div>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group-login">
              <label>Email</label>
              <input
                type="email"
                placeholder="info@cherry.com"
                id="email"
                name="email"
                defaultValue={emailLogin ? emailLogin : ''}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group-login">
              <label>Password:</label>
              <input
                type="password"
                placeholder="password"
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Link to="/progress-bar-form">
              <button
                className={
                  isButtonDisabled
                    ? "login-button-disabled"
                    : "login-button-enabled"
                }
                disabled={isButtonDisabled}
                type="submit"
              >
                Log In
              </button>
            </Link>
          </form>
          <div className="register-account">
            <p>Not a member yet?</p>
            <button className="register-button">
              Register Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
