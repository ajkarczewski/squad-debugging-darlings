import '../CSS/LoginModal.css';
import {useState} from 'react';

 const LoginModal = ({ onClose }) => {
   const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);


  const handleSubmit = (e) => {
    e.preventDefault();
    // login logic needs to be here for button to be enabled
  };
  return (
    <>
      <div id="login-modal" className="modal">
        <div className="modal-content-login">
          <div className='title-login'>
          <span className="close" onClick={onClose}>&times;</span>
            <h1>Welcome back to Cherry on Tech!</h1>
            <p>Log in with your email</p>
            <p>Looks like you may already have an account with us. Use your credentials to log in instead.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group-login">
              <label htmlFor="email">Email</label>
              <input type="email" placeholder="info@cherry.com" id="email" name="email" required />
            </div>
            <div className="form-group-login">
              <label htmlFor="password">Password:</label>
              <input type="password" placeholder="password" id="password" name="password" required />
            </div>
            <button disabled={isButtonDisabled} className={isButtonDisabled ? "login-button-disabled" : "login-button-enabled"} type="submit">Log In</button>
          </form>
          <div>
            <p>Not a member yet?</p>
            <button>Register Now</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;