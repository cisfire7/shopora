import React, { useEffect } from 'react'
import  '../OrderStyles/MyOrders.css'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import PageTitle from '../Components/PageTitle'
import { Link } from 'react-router-dom'
import { LaunchOutlined } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { getAllMyOrders } from '../features/order/orderSlice'
import Loader from '../Components/Loader'


function MyOrders() {
    const {orders , loading} = useSelector(state=>state.order)
    console.log(orders);
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(getAllMyOrders());
    },[dispatch])
  return (
    <div>
    <Navbar/>
    <PageTitle title="My Orders"/>
    {loading?(<Loader/>):orders.length>0 ? (<div className="my-orders-container">
        <h1>My Orders</h1>
        <div className="table-responsive">
           <table className="orders-table">
    <thead>
        <tr> {/* 1. Wrap headers in a row */}
            <th>Order ID</th>
            <th>Items Count</th>
            <th>Status</th>
            <th>Total Price</th>
            <th>View Orders</th>
        </tr>
    </thead>
    <tbody> {/* 2. Use ONLY ONE tbody */}
        {orders && orders.map((order) => (
            <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.orderItems?.length || 0}</td>
                <td>{order.orderStatus}</td>
                <td>{order.totalPrice}</td>
                <td>
                    <Link to={`/order/${order._id}`}>
                        <LaunchOutlined />
                    </Link>
                </td>
            </tr>
        ))}
    </tbody>
</table>
        </div>
    </div>):(
        <div className="no-order"><p className="no-order-message">No orders found</p></div>
    )}
    <Footer/>
    </div>
  )
}

export default MyOrders