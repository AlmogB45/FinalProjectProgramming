import React from 'react';
import './Login.css';
import logoImage from "./assets/LOGO1.png";

function Login() {
  return (
    <div className="login-container">
    <div className="left-panel">
      <div className="logo">
      <img src= {logoImage} alt ="logo" />
        <h1>LENDLOOP</h1>
      </div>
      <div className="sign-in-panel">
        <h2>Sign in to dashboard</h2>
      <form>
        <div className="input-container">
          <input type="text" placeholder="Username / Email" />
        </div>
        <div className="input-container">
          <input type="password" placeholder="Password" />
        </div>
        <div className="button-container">
  <button className="log" type="submit">Sign In</button>
  <button className="reg" type="button">Register</button>

</div>

<div className='login-link-container'>
<a href="#" className="login-link">Can't login? Click here!</a>  
</div>
      </form>
    </div>
    </div>
    <div className="right-panel">
    <h2>Join Our Community</h2>
        <p>LENDLOOP offers an innovative experience in the field of item lending. Made for users of all kinds, with no need to possess a social network account. LENDLOOP offers an ease-of-use not seen before with it's intuitive yet simple layout and plenty of quality of life features not seen in other websites!</p>
      </div>
    </div>
  );
}



export default Login;