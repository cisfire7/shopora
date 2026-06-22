import React, { useEffect, useState } from 'react'
import '../UserStyles/Form.css'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, removeError, removeSuccess } from '../features/user/userSlice';
import { toast } from 'react-toastify';

function LoginMe() {
    const{error , loading , success , isAuthenticated } = useSelector((state)=>state.user);
    const dispatch = useDispatch(); 
    const [loginEmail , setLoginEmail] = useState("");
    const [loginPassword , setLoginPassword] = useState("");
    const location = useLocation();
    const redirect = new URLSearchParams(location.search).get("redirect") || "/";
    const navigate = useNavigate();

    const loginSubmit = (e) => {
        e.preventDefault();
        dispatch(login({email:loginEmail,password:loginPassword}))
    }
        useEffect(() => {
            if(error){
                toast.error(error , {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "dark",
                });
                dispatch(removeError());
            };
        },[dispatch,error]);
        useEffect(() => {
            if(isAuthenticated){
              navigate(redirect);
            }
        })
       useEffect(() => {
        if(success){
            toast.success("login Successful" , {
                position: "top-center",
                autoClose: 3000,
                theme: "dark",
            });
            dispatch(removeSuccess());
        }
    },[dispatch,success])
  return (
    <div className="form-container container">
        <div className="form-content">
            
            <form action="" className='form' onSubmit={loginSubmit}>
                <h2>Sign In</h2>
                <div className="input-group">
                    <input type='email' value={loginEmail} onChange={(e)=>setLoginEmail(e.target.value)} placeholder='Email'/>
                </div>
                 <div className="input-group">
                    <input type='password' value={loginPassword} onChange={(e)=>setLoginPassword(e.target.value)} placeholder='Password'/>
                </div>
                <button className="authBtn">Sign In</button>
                <p className="form-links">Forgot your password?<Link to="/forgot/password">Reset Here</Link> </p>
                <p className="form-links">Don't have an account?<Link to="/register">Sing Up Here</Link> </p>

            </form>
        </div>
    </div>
  )
}

export default LoginMe