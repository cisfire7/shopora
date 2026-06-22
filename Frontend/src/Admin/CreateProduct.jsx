import React, { useEffect, useState } from "react";
import "../AdminStyles/CreateProduct.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import PageTitle from "../Components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, removeError, removeSuccess } from "../features/admin/adminSlice";
import { toast } from "react-toastify";
function CreateProduct() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState("");
    const [image, setImage] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);
    const { loading, error, success } = useSelector((state) => state.admin);
    const dispatch = useDispatch();

    const categories = [
  "Smartphones",
  "Laptops & PCs",
  "Electronics & Gadgets",
  "Men's Fashion",
  "Women's Fashion",
  "Mens's Footwear",
  "Caps & Accessories",
  "Watches & Wearables",
  "Beauty & Skincare",
  "Health & Wellness",
  "Sports & Fitness",
  "Outdoor & Travel",
  "Home & Living",
  "Lifestyle Essentials",
  "Books & Stationery",
  "Toys & Games",
  "Musical Instruments",
];

    const createProductSubmit = (e) => {
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
        dispatch(createProduct(myForm));
      };
    useEffect(() => {
    // This clears any leftover success or error messages from previous actions
    dispatch(removeSuccess());
    dispatch(removeError());
     }, [dispatch]);
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
            toast.success("Product Created Successfully" , {
                position: "top-center",
                autoClose: 3000,
                theme: "dark",
            });
            dispatch(removeSuccess());
            setName("");
            setPrice("");
            setDescription("");
            setCategory("");
            setStock("");
            setImage([]);
            setImagePreview([]);
        }
      },[dispatch, error , success]);
      const createProductImage = (e) => {
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
      };
  return (
    <>
      <Navbar />
      <PageTitle title="Create Product" />
      <div className="create-product-container">
        <h1 className="form-title">Create Product</h1>
        <form className="product-form" encType="multipart/form-data" onSubmit={createProductSubmit}>
          <input
            type="text"
            placeholder="Enter Product Name"
            className="form-input"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Enter Product Price"
            className="form-input"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Enter Product Description"
            className="form-input"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          /> 
          <select name="category" className="form-select" required
          value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
        </select>
         <input
            type="number"
            placeholder="Enter Product Stock"
            className="form-input"
            name="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
          <div className="file-input-container">
            <input 
            type="file"
            accept="image/"
            name="image"
            className="form-input-file"
            required
            multiple
            onChange={createProductImage}
            />
          </div>
          <div className="image-preview-container">
            {imagePreview.map((img,index)=>(<img src={img} alt="Product Preview" key={index} className="image-preview" />))}
          </div>
          <button className="submit-btn">{loading ? "Creating..." : "Create"}</button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default CreateProduct;
