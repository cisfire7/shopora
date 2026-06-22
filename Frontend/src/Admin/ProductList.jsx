import React, { useEffect } from 'react'
import '../AdminStyles/ProductsList.css'
import Navbar from '../Components/Navbar'
import PageTitle from '../Components/PageTitle'
import Footer from '../Components/Footer'
import { Link } from 'react-router-dom'
import { Delete, Edit } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../Components/Loader'
import { deleteProduct, fetchAdminProducts, removeError } from '../features/admin/adminSlice'
import { toast } from 'react-toastify'
function ProductList() {
  const {products , loading , error , deleting } = useSelector((state)=>state.admin);
  const dispatch = useDispatch();
  useEffect(() => {
      dispatch(fetchAdminProducts());
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
  if(!products || products.length === 0){
    return(
      <div className="product-list-container">
          <h1 className="product-list-title">All Products</h1>
          <p className='admin-no-products'>No Products Found</p>
      </div>
    )
  }
  const handleDelete = (productId) => {
     const isConfirmed = window.confirm('Are you sure you want to delete this product?');
     if(isConfirmed){
        dispatch(deleteProduct(productId)).then((action)=>{
            if(action.type==='admin/deleteProduct/fulfilled'){
                toast.success("Product Deleted Successfully" , {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "dark",
                });
            }
        });
     }
  }
  return (
    <>
    {loading ? <Loader/> :(<>
    <Navbar/>
    <PageTitle title="All Products"/>
    <div className="product-list-container">
        <h1 className="product-list-title">All Products</h1>
        <table className="product-table">
            <thead>
                <tr>
                    <th>Sl No</th>
                    <th>Product Image</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Ratings</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Created At</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product,index)=>(
                    <tr key={product._id}>
                    <td>{index+1}</td>
                    <td><img src={product.image[0].url} className='admin-product-image'></img></td>
                    <td>{product.name}</td>
                    <td>{product.price}/-</td>
                    <td>{product.ratings}</td>
                    <td>{product.category}</td>
                    <td>{product.stock}</td>
                    <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                    <td>
<Link 
  to={`/admin/product/${product._id}`} 
  className='action-icon edit-icon' 
  onClick={() => dispatch(removeSuccess())} // Clear success state here
>
  <Edit/>
</Link>
                        <button className="action-icon delete-icon" onClick={()=>{handleDelete(product._id)}} disabled={deleting[product._id]}>{deleting[product._id]?<Loader/>:<Delete/>}</button>
                    </td>
                </tr>))};
            </tbody>
        </table>
    </div>
    <Footer/>
    </>)}
    </>
  )
}

export default ProductList