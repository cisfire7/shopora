import React, { useEffect, useState } from 'react'
import '../AdminStyles/UpdateProduct.css'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import PageTitle from '../Components/PageTitle'
import { useDispatch, useSelector } from 'react-redux'
import { getProductDetails } from '../features/products/productSlice';
import { removeError, removeSuccess } from '../features/admin/adminSlice';

import { updateProduct } from '../features/admin/adminSlice'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'


function UpdateProduct() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState("");
    const [image, setImage] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);
    const [oldImage, setOldImage] = useState([]);
    const {product} = useSelector(state=>state.product);
    const {success, error , loading} = useSelector(state=>state.admin);
    const dispatch = useDispatch();
    const {updateId} = useParams();
    const navigate = useNavigate();

    useEffect(()=>{
       if(updateId){
          dispatch(getProductDetails(updateId));
       }
    },[dispatch , updateId])

useEffect(() => {
  if (product && Array.isArray(product.image)) {
    setName(product.name || "");
    setCategory(product.category || "");
    setPrice(product.price || "");
    setStock(product.stock || "");
    setDescription(product.description || "");
    setOldImage(product.image);
  } else {
    setOldImage([]);
  }
}, [product]);




    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImage([]);
        setImagePreview([]);

        files.forEach((file) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (reader.readyState === 2) {
              setImagePreview((old) => [...old, reader.result]);
              setImage((old) => [...old, reader.result]);
            }
          };
          reader.readAsDataURL(file);
        });
    }
    const categories =[
        "Mobile",
        "Shirt",
        "Accessories",
        "Camera",
        "Laptop",
        "Headphones",
        "Food",
        "Books",
        "Clothes/Shoes",
        "Beauty/Health",
        "Sports",
        "Outdoor",
        "Home"
    ]
    const updateProductSubmit=(e)=>{
        e.preventDefault();
            const myForm = new FormData();
            myForm.set("name", name);
            myForm.set("price", price);
            myForm.set("description", description);
            myForm.set("category", category);
            myForm.set("stock", stock);
            image.forEach((img) => {
            myForm.append("image", img);
            });
            dispatch(updateProduct({id:updateId,formData:myForm}));
    }
           useEffect(() => {
            if (error) {
              toast.error(error, {
                position: "top-center",
                autoClose: 3000,
                theme: "dark",
              });
              dispatch(removeError());
            }
            if(success){
                toast.success("Product Updated Successfully" , {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "dark",
                });
                dispatch(removeSuccess());
                navigate('/admin/products')
            }
          },[dispatch, error , success]);
  return (
    <>
    <Navbar/>
    <PageTitle title="Update Product"/>
    <div className="update-product-wrapper">
        <h1 className="update-product-title">Update Product</h1>

        <form
  className="update-product-form"
  encType="multipart/form-data"
  onSubmit={updateProductSubmit}
>


        <label htmlFor="name">Product Name</label>
        <input type="text" name='name' id="name" className='update-product-input' value={name} onChange={(e) => setName(e.target.value)} required/>

        <label htmlFor="price">Product Price</label>
        <input type="number" name='price' id="price" className='update-product-input' value={price} onChange={(e) => setPrice(e.target.value)}  required/>

        <label htmlFor="description">Product Description</label>
        <textarea type="text" name='description' id="description" className='update-product-textarea' value={description} onChange={(e) => setDescription(e.target.value)} required/>

         <label htmlFor="category">Product Category</label>
        <select name='category' id="category" className='update-product-select' value={category} onChange={(e) => setCategory(e.target.value)}  required>
        <option value="">Select a category</option>
        {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
        ))}
        </select>

        <label htmlFor="stock">Product Stock</label>
        <input type="number" name='stock' id="stock" className='update-product-input' value={stock} onChange={(e) => setStock(e.target.value)}  required/>

        <label htmlFor="image">Product Images</label>
        <div className="update-product-file-wrapper">
            <input type="file" className='update-product-file-input' accept='image/' name='image' id ="image" multiple onChange={handleImageChange} />
        </div>
        <div className="update-product-preview-wrapper">
          {imagePreview.map((img,index)=>(<img src={img} alt="Product Preview" key={index} className='update-product-preview-image'/>))}
        </div>
       <div className="update-product-old-images-wrapper">
  {Array.isArray(oldImage) && oldImage.length > 0 &&
    oldImage.map((img, index) => (
      <img
        key={index}
        src={img.url}
        alt="Old Image Preview"
        className="update-product-old-image"
      />
    ))
  }
</div>

        <button type="submit" className="update-product-submit-btn">
  {loading ? "Updating product..." : "Update Product"}
</button>

        </form>
    </div>
    <Footer/>
    </>
  )
}

export default UpdateProduct
