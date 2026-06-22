import React, { useEffect, useState } from 'react'
import '../UserStyles/Form.css'
import PageTitle from '../Components/PageTitle'
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeError, removeSuccess, resetPassword } from '../features/user/userSlice';
import { toast } from 'react-toastify';

function ResetPassword() {
    const {loading , error , success } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const {token} = useParams();
 const resetPasswordSubmit = (e) => {
    e.preventDefault();
    const userData = {
        password: password,
        confirmPassword: confirmPassword
    };
    dispatch(resetPassword({ token, userData }));
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
                toast.success("Password Reset Successfully" , {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "dark",
                });
                dispatch(removeSuccess());
                navigate('/login')
            }
            }, [dispatch, success, navigate]);
  return (
    <>
    <PageTitle title="Reset Password" />
        <div className="container form-container">
        <div className="form-content">
            <form action="" className='form' onSubmit={resetPasswordSubmit}>
                <h2>Reset Password</h2>
            <div className="input-group">
                <input type="password" value={password} name ='Password' placeholder='Password' onChange={(e)=>setPassword(e.target.value)}/>
            </div>
            <div className="input-group">
                <input type="password" value={confirmPassword} name ='confirmPassword' placeholder='Confirm Password' onChange={(e)=>setConfirmPassword(e.target.value
                )}/>
            </div>
            <button className="authBtn">Reset Password</button>
            </form>
        </div>
    </div>
    </>
  )
}


export default ResetPassword