import React, { use, useEffect, useState } from 'react'
import '../UserStyles/Form.css'
import PageTitle from '../Components/PageTitle'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { removeError, removeSuccess, updatePassword } from '../features/user/userSlice'
import { toast } from 'react-toastify'
function UpdatePassword() {
    const {loading , error , success , message} = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const updatePasswordSubmit = (e) => {

        e.preventDefault();
        const myForm = new FormData();
        myForm.set("oldPassword" , oldPassword);
        myForm.set("newPassword" , newPassword);
        myForm.set("confirmPassword" , confirmPassword);
        dispatch(updatePassword(myForm));
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
        if (success) {
            toast.success("Password Updated Successfully" , {
                position: "top-center",
                autoClose: 3000,
                theme: "dark",
            });
            dispatch(removeSuccess());
            navigate("/profile"); 
        }
        }, [dispatch, success, navigate]);
  return (
    <>
    <PageTitle title="Update Password"/>
    <Navbar/>
    <div className="container update-container">
        <div className="form-content">
            <form action="" className='form' onSubmit={updatePasswordSubmit}>
                <h2>Update Password</h2>
            <div className="input-group">
                <input type="password" value={oldPassword} name='oldPassword' placeholder='Old Password' onChange={(e)=>setOldPassword(e.target.value)}/>
            </div>
            <div className="input-group">
                <input type="password" value={newPassword} name ='newPassword' placeholder='New Password' onChange={(e)=>setNewPassword(e.target.value)}/>
            </div>
            <div className="input-group">
                <input type="password" value={confirmPassword} name ='confirmPassword' placeholder='Confirm Password' onChange={(e)=>setConfirmPassword(e.target.value
                )}/>
            </div>
            <button className="authBtn">Update Password</button>
            </form>
        </div>
    </div>
    <Footer/>
    </>
  )
}

export default UpdatePassword