import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence, browserLocalPersistence, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../Firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../CSS/Login.css';
import logoImage from "../assets/LOGO1.png";


export default function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loginError, setLoginError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  const email = watch('email');

  const onLogin = async (data) => {
    console.log("Attempting login with:", data.email);
    console.log("Login attempt with:", data);
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      console.log("User authenticated:", user.uid);

      localStorage.setItem('rememberMe', rememberMe);

      // Fetch additional user data from Firestore
      const userDocRef = doc(db, 'Users', user.uid);
      console.log("Attempting to fetch document:", userDocRef.path);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        console.log("Additional user data:", userData);
      } else {
        console.log("No additional user data found");
      }
      toast.success("Login successful!");
      navigate("/mainpage");
    } catch (error) {
      toast.error("Login error:", error.code, error.message);
      setLoginError("Invalid email or password. Please try again.");
    }
  };

  // Handles password reset action
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.info("Please fill in your email address in the appropriate field first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.info("Password reset email sent. Please check your inbox.");
      setLoginError(null);
    } catch (error) {
      toast.error("Password reset error:", error);
      toast.error("Failed to send password reset email. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="left-panel">
        <div className="logoLog">
          <img src={logoImage} alt="logoLog" />
          <h1>LENDLOOP</h1>
        </div>
        <div className="sign-in-panel">
          <h3>Sign in to dashboard</h3>
          <form onSubmit={handleSubmit(onLogin)}>

            <div className="input-container">
              <input {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })} type="email" placeholder="Email" />
              {/* {errors.email && <p className="error-message">{errors.email.message}</p>} */}
            </div>

            <div className="input-container">
              <input  {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long"
                }
              })} type="password" placeholder="Password" />
              {/* {errors.password && <p className="error-message">{errors.password.message}</p>} */}
            </div>

            <div className="remember-me-container">
              <label>
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              Remember me
              </label>
            </div>

          
            <div className='login-link-container'>
            <a href="#" className="login-link" onClick={handlePasswordReset}>Can't login? Click here!</a>
            </div>

            <div className="separatorLogin"></div>
            
            {loginError && <p className="error-message">{loginError}</p>}

            <div className="button-container">
              <button className="log" type="submit">Sign In</button>
              <Link to="/register" className="reg-button">
                Register
              </Link>
            </div>

          </form>
        </div>
      </div>

      <div className="right-panel">
        <h2>Join Our Community</h2>
        <p>LENDLOOP offers an innovative experience in the field of item lending. Made for users of all kinds, with no need of a social network account. LENDLOOP offers an ease-of-use not seen before with it's intuitive yet simple layout and plenty of quality of life features not seen in other websites!</p>
      </div>
    </div>
  );
}




