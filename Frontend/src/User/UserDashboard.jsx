import React, { useState } from 'react'
import '../UserStyles/UserDashboard.css'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, removeError, removeSuccess } from '../features/user/userSlice';
import { toast } from 'react-toastify';
function UserDashboard({user}) {
    const dispatch = useDispatch();
    const [menuVisible, setMenuVisible] = useState(false);
    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    }
    const {cartItems} = useSelector(state => state.cart);
    const options =[
        {name:'AI Assistant',funcName:aiAssistant, isAI:true },
        {name:'Smart Refill',funcName:smartRefill },
        {name:'AI Picks',funcName:aiPicks },
        {name:'Orders',funcName:orders },
        {name:'Account',funcName:account },
        {name:`Cart (${cartItems.length})`,funcName:myCart , isCart:true},
        {name:'Logout',funcName:logoutUser },
    ]
    if(user.role === "admin"){
        options.unshift(
            {name:'Admin Dashboard',funcName:dashboard }
        )
    }
    const navigate = useNavigate();
    function orders(){
        navigate("/orders/user")
    }
    function aiAssistant(){
        navigate("/ai/assistant")
    }
    function smartRefill(){
        navigate("/ai/replenishment")
    }
    function aiPicks(){
        navigate("/ai/personalized")
    }
    function account(){
        navigate("/profile")
    }
    function myCart(){
        navigate("/cart")
    }
    function logoutUser(){
        dispatch((logout()))
        .unwrap()
        .then(()=>{
            toast.success("Logout Successful" , {
                position: "top-center",
                autoClose: 3000,
                theme: "dark",
            });
            dispatch(removeSuccess());
            navigate('/login')
        })
        .catch((error)=>{
            toast.error(error?.message || 'Logout Failed' , {
                position: "top-center",
                autoClose: 3000,
                theme: "dark",
            });
            dispatch(removeError());
        })

    }
    function dashboard(){
        navigate("/admin/dashboard")
    }
  return (<>
    <div className={`overlay ${menuVisible ? 'show' : ''}`} onClick={toggleMenu} ></div>
    <div className="dashboard-container">
        <div className="profile-header" onClick={toggleMenu}>
        <img src={ user.avatar.url ? user.avatar.url: "./images/ProfileImage.jpeg" } alt="Profile Picture" className='profile-avatar' />
        <span className="profile-name">{user.name||"User"}</span>
        </div>
       {menuVisible &&( <div className="menu-options">
            {options.map((item)=>(<button className={`menu-option-btn ${item.isCart ? (cartItems.length>0?'cart-not-empty':""):""} ${item.isAI ? 'ai-btn-glow' : ''}`}onClick={item.funcName} key={item.name}>{item.name}</button>))}
        </div>)}
    </div>
    </>
  )
}

export default UserDashboard