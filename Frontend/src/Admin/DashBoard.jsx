import React, { useEffect } from 'react'
import "../AdminStyles/Dashboard.css"
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import PageTitle from '../Components/PageTitle'
import { AddBox, AttachMoney, CheckBox, CheckCircle, Dashboard, Error, Instagram, Inventory, LinkedIn, People, ShoppingCart, Star, YouTube } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {fetchAdminProducts, fetchAllOrders} from '../features/admin/adminSlice'
function DashBoard() {
    const {orders , products , totalAmount} = useSelector(state=>state.admin);
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(fetchAdminProducts());
        dispatch(fetchAllOrders());
    },[dispatch])

    const totalProducts = products.length;
    const totalOrder = orders.length;
    const outOfStock = products.filter(product=>product.stock===0).length;
    const InStock = products.filter(product=>product.stock>0).length;
  return (
    <>
    <Navbar/>
    <PageTitle title="Admin DashBoard"/>
    <div className="dashboard-container">
        <div className="sidebar">
            <div className="logo">
                <Dashboard className='logo-icon'/>
                Admin Dashboard
            </div>
            <div className="nav-menu">
                <div className="nav-section">
                    <h3>Products</h3>
                    <Link to='/admin/products'>
                    <Inventory className='nav-icon'/>
                    All Products
                    </Link>
                     <Link to='/admin/product/create'>
                    <AddBox className='nav-icon'/>
                    Create Product
                    </Link>
                    
                </div>
                <div className="nav-section">
                    <h3>Users</h3>
                    <Link to='/admin/users'>
                    <People className='nav-icon'/>
                    All Users
                    </Link>
                </div>
                 <div className="nav-section">
                    <h3>Orders</h3>
                    <Link to='/admin/orders'>
                    <ShoppingCart className='nav-icon'/>
                    All Orders
                    </Link>
                </div>
                 {/* <div className="nav-section">
                    <h3>Reviews</h3>
                    <Link to='/reviews'>
                    <Star className='nav-icon'/>
                    All Reviews
                    </Link>
                </div> */}
            </div>
        </div>
        <div className="main-content">
            <div className="stats-grid">
                <div className="stat-box">
                    <Inventory className='icon'/>
                    <h3>Total Products</h3>
                    <p>{totalProducts}</p>
                </div>
                <div className="stat-box">
                    <ShoppingCart className='icon'/>
                    <h3>Total Orders</h3>
                    <p>{totalOrder}</p>
                </div>
                {/* <div className="stat-box">
                    <Star className='icon'/>
                    <h3>Total Reviews</h3>
                    <p>9</p>
                </div> */}
                <div className="stat-box">
                    <AttachMoney className='icon'/>
                    <h3>Total Revenue</h3>
                    <p>{totalAmount}/-</p>
                </div> 
                <div className="stat-box">
                    <Error className='icon'/>
                    <h3>Out Of Stock</h3>
                    <p>{outOfStock}</p>
                </div> 
                 <div className="stat-box">
                    <CheckCircle className='icon'/>
                    <h3>In Stock</h3>
                    <p>{InStock}</p>
                </div>
            </div>

            <div className="social-stats">
                <div className="social-box instagram">
                    <Instagram/>
                    <h3>Instagram</h3>
                    <p>123k followers</p>
                    <p>12 posts</p>
                </div>
                 <div className="social-box linkedin">
                    <LinkedIn/>
                    <h3>Linkedin</h3>
                    <p>120k followers</p>
                    <p>12 posts</p>
                </div>
                 <div className="social-box Youtube">
                    <YouTube/>
                    <h3>Youtube</h3>
                    <p>120k followers</p>
                    <p>12 Videos</p>
                </div>
            </div>
        </div>
    </div>
    {/* <Footer/> */}
    </>
  )
}

export default DashBoard