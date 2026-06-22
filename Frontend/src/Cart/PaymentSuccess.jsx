import React, { useEffect } from 'react';
import '../CartStyles/PaymentSuccess.css';
import { Link, useSearchParams } from 'react-router-dom';
import PageTitle from '../Components/PageTitle';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Loader from '../Components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createOrder, removeError, removeSuccess } from '../features/order/orderSlice'; 
import { clearCart } from '../features/cart/cartSlice';

function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const reference = searchParams.get("reference");
    const dispatch = useDispatch();
    
    const { loading, error, success } = useSelector((state => state.order));
    const { shippingInfo, cartItems } = useSelector(state => state.cart);

    useEffect(() => {
        const createOrderData = async () => {
            try {
                const orderItem = JSON.parse(sessionStorage.getItem('orderItem'));
                
                // If no orderItem in session, don't proceed (prevents duplicate orders on refresh)
                if (!orderItem) return;

                const orderData = {
                    shippingInfo: {
                        address: shippingInfo.address,
                        city: shippingInfo.city,
                        state: shippingInfo.state,
                        country: shippingInfo.country,
                        pinCode: shippingInfo.pinCode,
                        phoneNo: shippingInfo.phoneNumber
                    },
                    orderItems: cartItems.map((item) => ({
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image,
                        product: item.product
                    })),
                    paymentInfo: {
                        id: reference,
                        status: 'succeeded'
                    },
                    itemsPrice: orderItem.subtotal,
                    taxPrice: orderItem.tax,
                    shippingPrice: orderItem.shippingCharges,
                    totalPrice: orderItem.total
                };

                dispatch(createOrder(orderData));
                
                // Remove item immediately so a refresh doesn't trigger another order
                sessionStorage.removeItem('orderItem'); 
            } catch (err) {
                console.log("order creating error", err);
            }
        };

        if (reference) {
            createOrderData();
        }
    }, [dispatch, reference, shippingInfo, cartItems]); // Added proper dependencies

    useEffect(() => {
        if (success) {
            toast.success("Order Placed Successfully", {
                position: 'top-center',
                autoClose: 3000,
                theme: "dark"
            });
            dispatch(clearCart());
            dispatch(removeSuccess());
        }
    }, [dispatch, success]);

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: 'top-center',
                autoClose: 3000,
                theme: "dark"
            });
            dispatch(removeError());
        }
    }, [dispatch, error]);

    return (
        <>
            <PageTitle title="Payment Successful" />
            <Navbar />
            {loading ? (
                <Loader />
            ) : (
                <div className="payment-success-container">
                    <div className="success-content">
                        <div className="success-icon">
                            <div className="checkmark"></div>
                        </div>
                        <h1>Order Confirmation</h1>
                        <p>Your Payment was successful. Reference ID: <strong>{reference}</strong></p>
                        <Link to="/orders/user" className='explore-btn'>View Orders</Link>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}

export default PaymentSuccess;