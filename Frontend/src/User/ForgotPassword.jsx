import React, { useEffect, useState } from 'react'
import '../UserStyles/Form.css'
import PageTitle from '../Components/PageTitle'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { forgotPassword, removeError, removeSuccess } from '../features/user/userSlice'
import { toast } from 'react-toastify'
import Loader from '../Components/Loader'
function ForgotPassword() {
    const {loading , error , success , message} = useSelector(state => state.user);
    const [email , setEmail] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const forgotPasswordEmail = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("email" , email);
        dispatch(forgotPassword(myForm));
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
                toast.success(message , {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "dark",
                });
                dispatch(removeSuccess());
            }
            }, [dispatch, success, navigate]);
  return (
    <>
    {loading ? <Loader/> :(<>
    <PageTitle title = "Forgot Password"/>
    <Navbar/>
    <div className="container forgot-container">
        <div className="form-content email-group">
            <form action="" className="form" onSubmit={forgotPasswordEmail}>
                <h2>Forgot Password</h2>
                <div className="input-group">
                    <input type="email" name="email" placeholder="Enter Your Registered Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                </div>
                <button className="authBtn">Send</button>
            </form>
        </div>
    </div>
    <Footer/>
    </>)}
    </>
  )
}

export default ForgotPassword