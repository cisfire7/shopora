import React from 'react'
import '../CartStyles/Payment.css'
import PageTitle from '../Components/PageTitle'
import Navbar from '../Components/Navbar'
import CheckoutPath from './CheckoutPath'
import Footer from '../Components/Footer'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'

function Payment() {
    const orderItem = JSON.parse(sessionStorage.getItem('orderItem'));
        const {user} = useSelector(state => state.user);
        const {shippingInfo} = useSelector(state => state.cart);
        const navigate = useNavigate();
    const completePayment = async(amount) => {
        try{
        const {data:keyData} = await axios.get('/api/v1/getKey');
        const {key} = keyData;
        const {data : orderData} = await axios.post('/api/v1/payment/process',{amount});
        const {order} = orderData ;
          // Open Razorpay Checkout
        const options = {
        key, // Replace with your Razorpay key_id
        amount, // Amount is in currency subunits.
        currency: 'INR',
        name: 'E_Commerce',
        description: 'E_Commerce Payment Transaction',
        order_id: order.id , // This is the order_id created in the backend
        // callback_url: '/api/v1/paymentVerification', // Your success URL
        handler:async function(response){
            const {data} = await axios.post('/api/v1/paymentVerification',{
                razorpay_payment_id:response.razorpay_payment_id ,
                razorpay_order_id:response.razorpay_order_id,
                razorpay_signature:response.razorpay_signature }
            );
            if(data.success){
                navigate(`/paymentSuccess?reference=${data.reference}`);
            }
            else{
                alert("Payment Failed")
            }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: shippingInfo.phoneNumber 
        },
        theme: {
          color: '#3399CC',
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    }catch(error){
        console.log("Payment Error",error)
    }

    }
  return (
    <>
    <PageTitle title="Payment Processing"/>
    <Navbar/>
    <CheckoutPath activePath={2}/>
    <div className="payment-container">
        <Link to="/order/confirm" className="payment-go-back">Go Back</Link>
        <button className="payment-btn" onClick={()=>completePayment(orderItem.total)}>Pay :- {orderItem.total}/-</button>
    </div>
    <Footer/>
    </>
  )
}

export default Payment