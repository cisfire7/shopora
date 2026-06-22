import React, { useEffect, useState } from 'react';
import '../UserStyles/Form.css';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import PageTitle from '../Components/PageTitle';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { register, removeError, removeSuccess } from '../features/user/userSlice';
function Register() {
    const{error,loading,success} =  useSelector((state)=>state.user);
    const dispatch = useDispatch();
    const [user , setUser] = useState({
        name : "",
        email : "",
        password : ""
    })
    const navigate = useNavigate();
    const {name , email , password } = user;
    const[avatar , setAvatar] = useState("");
    const[avatarPreview , setAvatarPreview] = useState("./images/ProfileImage.jpeg");
    const registerDataChange = (e) => {
        if(e.target.name === "avatar"){
           const reader =  new FileReader();
           reader.onload = () => {
                 if(reader.readyState === 2){
                setAvatarPreview(reader.result);
                setAvatar(reader.result);
            }
           }
           reader.readAsDataURL(e.target.files[0])
        }
        else{
            setUser({...user , [e.target.name] : e.target.value})
        }
    }
    const registerSubmit = (e) => {
        e.preventDefault();
        if(!name || !email || !password){
           toast.error("Please fill all the required fields" , {
            position: "top-center",
            autoClose: 3000,
            theme: "dark",
           })
        }
        const myForm = new FormData();
        myForm.set("name" , name);
        myForm.set("email" , email);
        myForm.set("password" , password);
        myForm.set("avatar" , avatar);
        console.log(myForm.entries());
        for(let pair of myForm.entries()){
            console.log(pair[0]+"="+pair[1]);
        }
        dispatch(register(myForm)) ;
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

// Register.jsx
    useEffect(() => {
    if (success) {
        toast.success("Registration Success");
        dispatch(removeSuccess());
        navigate("/"); 
    }
    }, [dispatch, success, navigate]);
  return (
    <>
    <div className="form-container container">
        <PageTitle title="Register User"/>
        <div className="form-content">
            <form action="" className='form' encType='multipart/form-data'  onSubmit={registerSubmit}>
                <h2>Sign Up</h2>
                <div className="input-group">
                    <input type="text" name="name" value={name} onChange={registerDataChange} placeholder='Username' />
                </div>
                 <div className="input-group">
                    <input type="email" name="email" value={email} onChange={registerDataChange} placeholder='Email' />
                </div>
                <div className="input-group">
                    <input type="password" name="password" value={password} onChange={registerDataChange} placeholder='Password' />
                </div>
                <div className="input-group avatar-group">
                    <input type="file" name="avatar" accept="image/" onChange={registerDataChange} className='file-input' />
                    <img src={avatarPreview} className='avatar' alt="Preview Image" />
                </div>
                <button className='authBtn'>{loading ? "Signing Up..." : "Sign Up"}</button>
                <p className="form-links">
                    Already have an account?<Link to="/login">Sign In here</Link>
                </p>
            </form>
        </div>
    </div>
    </>
  )
}

export default Register