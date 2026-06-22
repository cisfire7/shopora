
import React, { useEffect } from 'react';
import '../pageStyles/Home.css';
import Footer from '../Components/Footer';
import Navbar from '../Components/Navbar';
import ImageSlider from '../Components/ImageSlider';
import Product from '../Components/Product';
import PageTitle from '../Components/PageTitle';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct, removeError } from '../features/products/productSlice';
import Loader from '../Components/Loader';
import { toast } from 'react-toastify';
import SmartReplenishmentHome from '../AI/SmartReplenishmentHome';


function Home() {
    const{error,loading,products,productCount} =  useSelector((state)=>state.product);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getProduct({keyword:''}));
    },[dispatch])
    useEffect(() => {
        if(error){
            toast.error(error , {
                position: "top-center",
                autoClose: 3000,
                theme: "dark",
            });
            dispatch(removeError());
        }
    },[dispatch,error])
  return (
    <>

    {loading ? <Loader/> :(<>
    <Navbar/>
    <PageTitle title="Home-My Website"/>
    <ImageSlider/>
    <SmartReplenishmentHome/>
    <div className="home-container">
        <h2 className="home-heading">Trending Now</h2>
        <div className="home-product-container">
           { products.map((product,index)=>(
            <Product product={product} key={index} />
            ))}
        </div>
    </div>
    <Footer/>
    </>)
    }
    </>
  )
}

export default Home