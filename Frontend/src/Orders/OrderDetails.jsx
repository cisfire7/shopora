import React, { useEffect } from 'react'
import '../OrderStyles/OrderDetails.css'
import PageTitle from '../Components/PageTitle'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getOrderDetails, removeError } from '../features/order/orderSlice'
import { toast } from 'react-toastify'
import Loader from '../Components/Loader'

function OrderDetails() {
    const { orderId } = useParams();
    const { order = {}, loading, error } = useSelector(state => state.order);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getOrderDetails(orderId));

        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000, theme: 'dark' });
            dispatch(removeError());
        }
    }, [dispatch, orderId, error]);

    const {
        shippingInfo = {},
        orderItems = [],
        paymentInfo = {},
        orderStatus = "Processing",
        itemsPrice = 0,
        totalPrice = 0,
        taxPrice = 0,
        shippingPrice = 0,
        paidAt
    } = order;
    const paymentStatus = paymentInfo.status ==='succeeded' ? 'Paid' : 'Not Paid';
    const finalOrderStatus = paymentStatus  === 'Not Paid'?'Cancelled':orderStatus;
    return (
        <>
            <PageTitle title={`Order ${orderId}`} />
            <Navbar />

            {loading ? (
                <Loader />
            ) : (
                <div className="order-box">

                    {/* ================= ORDER ITEMS ================= */}
                    <div className="table-block">
                        <h2 className="table-title">Order Items</h2>

                        <table className="table-main">
                            <thead>
                                <tr className='table-row'>
                                    <th className='head-cell'>Image</th>
                                    <th className='head-cell'>Name</th>
                                    <th className='head-cell'>Quantity</th>
                                    <th className='head-cell'>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderItems.length > 0 ? (
                                    orderItems.map((item, index) => (
                                        <tr className='table-row' key={item._id || index}>
                                            <td className='table-cell'>
                                                <img src={item.image} alt={item.name} className='table-img' />
                                            </td>
                                            <td className='table-cell'>{item.name}</td>
                                            <td className='table-cell'>{item.quantity}</td>
                                            <td className='table-cell'>₹{item.price}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="table-cell">No items found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ================= SHIPPING INFO ================= */}
                    <div className="table-block">
                        <h2 className="table-title">Shipping Information</h2>

                        <table className="table-main">
                            <tbody>
                                <tr className='table-row'>
                                    <th className='table-cell'>Address</th>
                                    <td className='table-cell'>
                                        {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state}, {shippingInfo.country} - {shippingInfo.pinCode}
                                    </td>
                                </tr>
                                <tr className='table-row'>
                                    <th className='table-cell'>Phone</th>
                                    <td className='table-cell'>{shippingInfo.phoneNo}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* ================= ORDER SUMMARY ================= */}
                    <div className="table-block">
                        <h2 className="table-title">Order Summary</h2>

                        <table className="table-main">
                            <tbody>
                                <tr className='table-row'>
                                    <th className='table-cell'>Order Status</th>
                                    <td className='table-cell'>
                                        <span className={`status-tag ${orderStatus?.toLowerCase()}`}>
                                            {finalOrderStatus}
                                        </span>
                                    </td>
                                </tr>

                                <tr className='table-row'>
                                    <th className='table-cell'>Payment Status</th>
                                    <td className='table-cell'>
                                        <span className={`pay-tag ${paymentInfo?.status === "succeeded" ? "paid" : "unpaid"}`}>
                                            {paymentInfo?.status === "succeeded" ? "Paid" : "Not Paid"}
                                        </span>
                                    </td>
                                </tr>

                                <tr className='table-row'>
                                    <th className='table-cell'>Paid At</th>
                                    <td className='table-cell'>
                                        {paidAt ? new Date(paidAt).toLocaleString() : "Not Paid"}
                                    </td>
                                </tr>

                                <tr className='table-row'>
                                    <th className='table-cell'>Items Price</th>
                                    <td className='table-cell'>₹{itemsPrice}</td>
                                </tr>

                                <tr className='table-row'>
                                    <th className='table-cell'>Tax Price</th>
                                    <td className='table-cell'>₹{taxPrice}</td>
                                </tr>

                                <tr className='table-row'>
                                    <th className='table-cell'>Shipping Price</th>
                                    <td className='table-cell'>₹{shippingPrice}</td>
                                </tr>

                                <tr className='table-row'>
                                    <th className='table-cell'><b>Total Price</b></th>
                                    <td className='table-cell'><b>₹{totalPrice}</b></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            )}

            <Footer />
        </>
    )
}

export default OrderDetails;
