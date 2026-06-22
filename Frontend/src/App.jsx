
import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes , Route } from 'react-router-dom'
import Home from './Pages/Home.jsx'
import ProductDetails from './Pages/ProductDetails.jsx'
import Products from './Pages/Products.jsx'
import Register from './User/Register.jsx'
import LoginMe from './User/LoginMe.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { loadUser } from './features/user/userSlice.js'
import UserDashboard from './User/UserDashboard.jsx'
import Profile from './User/Profile.jsx'
import ProtectedRoutes from './Components/ProtectedRoutes.jsx'
import UpdateProfile from './User/UpdateProfile.jsx'
import UpdatePassword from './User/UpdatePassword.jsx'
import ForgotPassword from './User/ForgotPassword.jsx'
import ResetPassword from './User/ResetPassword.jsx'
import Cart from './Cart/Cart.jsx'
import PlaceShipping from './Cart/PlaceShipping.jsx'
import OrderConfirm from './Cart/OrderConfirm.jsx'
import Payment from './Cart/Payment.jsx'
import PaymentSuccess from './Cart/PaymentSuccess.jsx'
import MyOrders from './Orders/MyOrders.jsx'
import OrderDetails from './Orders/OrderDetails.jsx'
import DashBoard from './Admin/DashBoard.jsx'
import ProductList from './Admin/ProductList.jsx'
import CreateProduct from './Admin/CreateProduct.jsx'
import UpdateProduct from './Admin/UpdateProduct.jsx'
import UserList from './Admin/UserList.jsx'
import UpdateRole from './Admin/UpdateRole.jsx'
import OrdersList from './Admin/OrdersList.jsx'
import UpdateOrder from './Admin/UpdateOrder.jsx'
import AIAssistant from './AI/AIAssistant.jsx'
import AIHistory from './AI/AIHistory.jsx'
import AIChatbot from './AI/AIChatbot.jsx'
import SmartReplenishment from './AI/SmartReplenishment.jsx'
import ExplainableAI from './AI/ExplainableAI.jsx'

const App = () => {
  const {isAuthenticated , user} = useSelector(state => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if(isAuthenticated){
      dispatch(loadUser());
    }
  },[dispatch])
  console.log(isAuthenticated,user);
  return (
    <>
    <Router>
      <Routes>
       {/* --- Public Routes --- */}
        <Route path="/" element={<Home/>} />
        <Route path="/product/:id" element={<ProductDetails/>} />
        <Route path="/products" element={<Products/>} />
        <Route path="/products/:keyword" element={<Products/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<LoginMe/>} /> 
        <Route path="/forgot/password" element={<ForgotPassword/>} /> 
        <Route path="/reset/:token" element={<ResetPassword/>} /> 
        <Route path="/cart" element={<Cart/>} /> 

        {/* --- Protected Routes (Require Authentication) --- */}
        <Route path="/profile" element={<ProtectedRoutes element={<Profile/>}/>} /> 
        <Route path="/profile/update" element={<ProtectedRoutes element={<UpdateProfile/>}/>} /> 
        <Route path="/password/update" element={<ProtectedRoutes element={<UpdatePassword/>}/>} /> 
        <Route path="/shipping" element={<ProtectedRoutes element={<PlaceShipping/>}/>} /> 
        <Route path="/order/confirm" element={<ProtectedRoutes element={<OrderConfirm/>}/>} />
        <Route path="/process/payment" element={<ProtectedRoutes element={<Payment/>}/>} />
        <Route path="/paymentSuccess" element={<ProtectedRoutes element={<PaymentSuccess/>}/>} />
        <Route path="/orders/user" element={<ProtectedRoutes element={<MyOrders/>}/>} />
        <Route path="/order/:orderId" element={<ProtectedRoutes element={<OrderDetails/>}/>} />
         
         {/* Admin Routes  */}
         <Route path="/admin/dashboard" element={<ProtectedRoutes element={<DashBoard/>} adminOnly={true} />} />
         <Route path="/admin/products" element={<ProtectedRoutes element={<ProductList/>} adminOnly={true} />} />
         <Route path="/admin/product/create" element={<ProtectedRoutes element={<CreateProduct/>} adminOnly={true} />} />
         <Route path="/admin/product/:updateId" element={<ProtectedRoutes element={<UpdateProduct/>} adminOnly={true} />} />
         <Route path="/admin/users" element={<ProtectedRoutes element={<UserList/>} adminOnly={true} />} />
         <Route path="/admin/user/:userId" element={<ProtectedRoutes element={<UpdateRole/>} adminOnly={true} />} />
         <Route path="/admin/orders" element={<ProtectedRoutes element={<OrdersList/>} adminOnly={true} />} />
         <Route path="/admin/order/:orderId" element={<ProtectedRoutes element={<UpdateOrder/>} adminOnly={true} />} />

         {/* AI Routes */}
         <Route path="/ai/assistant" element={<ProtectedRoutes element={<AIAssistant/>}/>} />
         <Route path="/ai/history" element={<ProtectedRoutes element={<AIHistory/>}/>} />
         <Route path="/ai/replenishment" element={<ProtectedRoutes element={<SmartReplenishment/>}/>} />
         <Route path="/ai/personalized" element={<ProtectedRoutes element={<ExplainableAI/>}/>} />
      </Routes>
      {isAuthenticated && <UserDashboard user={user}/>}
    {isAuthenticated && <AIChatbot />}
    </Router>
    </>
  )
}

export default App