import React, { useEffect, useState } from 'react'
import '../pageStyles/Products.css'
import PageTitle from '../Components/PageTitle'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import Loader from '../Components/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { getProduct, removeError } from '../features/products/productSlice'
import { toast } from 'react-toastify'
import Product from '../Components/Product'
import { useLocation, useNavigate } from 'react-router-dom'
import NoProducts from '../Components/NoProducts'
import Pagination from '../Components/Pagination'


function Products() {
    const {loading,error,products,resultsPerPage,productCount} = useSelector((state)=>state.product);
    const dispatch = useDispatch();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    // console.log(searchParams);
    const keyword = searchParams.get('keyword');
    const category = searchParams.get('category');
    const pageFromUrl = parseInt(searchParams.get('page'),10) || 1;
    const [currentPage, setCurrentPage] = useState(pageFromUrl);
    const categories = [
  "Men Fashion",
  "Women Fashion",
  "Footwear",
  "Watches",
  "Jewellery",
  "Makeup",
  "Skincare",
  "Hair Care",
  "Perfume",
  "Medicine",
  "Healthcare",
  "Ayurveda",
  "Electronics",
  "Fitness",
  "Sports",
  "Grocery",
  "Dairy",
  "Beverages",
  "Food",
  "Snacks",
  "Bakery",
  "Spices",
  "Fruits",
  "Vegetables",
  "Frozen Food",
  "Ready to Eat",
  "Bags",
  "Accessories",
  "Clothing",
  "Home Decor",
  "Household",
  "Kitchen",
  "Cleaning",
  "Personal Care",
  "Baby Care",
  "Pet Supplies",
  "Stationery",
  "Sweets",
  "Dry Fruits",
  "Health Food",
];

    const navigate = useNavigate();
    console.log(keyword);
    useEffect(() => {
        dispatch(getProduct({keyword,page:currentPage,category}));
    },[dispatch,keyword,currentPage,category])
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

    const handlePageChange = (page) => {
        if(page !== currentPage){
            setCurrentPage(page);
            const newSearchParams = new URLSearchParams(location.search);
            if(page===1){
                newSearchParams.delete('page');
            }else{
                newSearchParams.set('page',page);
            }
            navigate(`?${newSearchParams.toString()}`); 
        }
    }
  if (loading) {
    return <Loader />;
  }
const handleCategoryClick = (category) => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set('category',category);
    newSearchParams.delete('page');
    navigate(`?${newSearchParams.toString()}`);
}
return (
    <>
        <PageTitle title="All Products"/>
        <Navbar/>
        <div className="products-layout">
            <div className="filter-section">
                <h3 className="filter-heading">CATEGORIES</h3>
                {/* Render All Categories */}
                <ul>
                    {categories.map((category)=>{
                    return(
                        <li key={category} onClick={()=>handleCategoryClick(category)}>{category}</li>
                    )
                    }
                    )}
                </ul>
            </div>
            <div className="products-section">
            {  products.length > 0 ? <div className="products-product-container">
                {products.map((product)=>(
                    <Product product={product} key={product._id} />
                ))}
            </div> : ( <NoProducts keyword={keyword} />) }
                <Pagination
                currentPage={currentPage}
                onPageChange={handlePageChange}
                activeClass='active'
                nextPageText='Next'
                lastPageText='Last'
                firstPageText='First'
                previPageText='Prev'
                />
            </div>
        </div>
        <Footer/>
    </>
);
}

export default Products