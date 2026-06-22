import React, { use, useEffect, useState } from 'react'
import '../UserStyles/Form.css'
import PageTitle from '../Components/PageTitle'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { removeError, removeSuccess, updateProfile } from '../features/user/userSlice'
import Loader from '../Components/Loader'

function UpdateProfile() {
const {loading , user , error, success , message} = useSelector((state) => state.user);
const dispatch = useDispatch();
const navigate = useNavigate();

    const [name , setName] = useState("");
    const [email , setEmail] = useState("");
    const [avatar , setAvatar] = useState("");
    const [avatarPreview , setAvatarPreview] = useState("./images/ProfileImage.jpeg");
    const profileImageUpdate = (e) => {
         const reader =  new FileReader();
           reader.onload = () => {
                 if(reader.readyState === 2){
                setAvatarPreview(reader.result);
                setAvatar(reader.result);
            }
           }
           reader.onerror = (error) => {
               toast.error("Error reading file")
           }
           reader.readAsDataURL(e.target.files[0])
    }
    const updateSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("name" , name);
        myForm.set("email" , email);
        myForm.set("avatar" , avatar);
        dispatch(updateProfile(myForm));
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
        if(success){
            toast.success(message , {
                position: "top-center",
                autoClose: 3000,
                theme: "dark",
            });
            dispatch(removeSuccess());
            navigate('/login');
        }
    })
    useEffect(() => {
        if(user){
            setName(user.name);
            setEmail(user.email);
            setAvatarPreview(user.avatar.url);
        }
    },[user])
  return (<>
   {loading ? <Loader/> :( <>
    <PageTitle title="Update Profile"/>
    <Navbar/>
    <div className="container update-container">
        <div className="form-content">
            <form action="" encType='multipart/form-date' onSubmit={updateSubmit} className="form">
            <h2>Update Profile</h2>
            <div className="input-group avatar-group">
                <input type="file" name="avatar" className='file-input' accept='image/' id="avatar" onChange={profileImageUpdate} />
                <img src={avatarPreview} alt="Profile Picture"  className='avatar'/>
            </div>
            <div className="input-group">
                <input type="text" name="name" value={name}  onChange={(e)=>setName(e.target.value)}/>
            </div>
            <div className="input-group">
                <input type="email" name="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            </div>
            <button className="authBtn">Update</button>
            </form>
        </div>
    </div>
    <Footer/>
    </>)}
    </>
  )
}

export default UpdateProfile