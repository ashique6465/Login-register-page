import React, { useState } from "react";
import "../App.css";
import axios, { Axios } from 'axios';
import {useNavigate} from 'react-router-dom'
import { Link } from "react-router-dom";

const Login = () => {
 
  const [email, setEmail] = useState("");
  const [password, setPasssword] = useState("");

  const navigate = useNavigate()
  const myObject = {};
myObject.withCredentials = true;

 

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/auth/login", {
        email,
        password,
      })
      .then((response) => {
        if(response.data.status){
          navigate('/')
        }
        
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="sign-up-container">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Admin</h2>
        
        <label htmlFor="email">Username:</label>
        <input
          type="email"
          autoComplete="off"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          placeholder="******"
          onChange={(e) => setPasssword(e.target.value)}
        />

        <button type="submit">Login</button>
        <Link to='/forgotPassword'>Forgot Password?</Link>
        <p>Don't Have Account?<Link to="/signup"> Sign Up</Link></p>
      </form>
    </div>
  );
};

export default Login;
