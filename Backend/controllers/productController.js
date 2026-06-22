
import handleAsyncError from "../middleware/handleAsyncError.js";
import Product from "../models/modelOfProduct.js";
import APIFunctionality from "../utils/apiFunctionality.js";
import HandleError from "../utils/handleError.js";
import {v2 as cloudinary} from "cloudinary";

export const createProducts = handleAsyncError( async (req, res) => {
    // console.log(req.body);
    let image=[];
    if(typeof req.body.image === "string"){
        image.push(req.body.image);
    }else{
        image = req.body.image;
    }
    const imageLinks=[];
    for(let i=0; i<image.length; i++){
        const result = await cloudinary.uploader.upload(image[i], {
            folder: "products",
        });
        imageLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }
    req.body.image = imageLinks;
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
})

// get all products
export const getAllProducts = handleAsyncError( async(req, res , next ) => {
    const resultPerPage = 20;
    const apiFeatures = new APIFunctionality(Product.find(), req.query).search().filter();
    const filteredQuery = apiFeatures.query.clone();
    const productCount = await filteredQuery.countDocuments();
    const totalPages = Math.ceil(productCount / resultPerPage);
    const page = Number(req.query.page) || 1;
    if(page > totalPages && productCount>0){
       return next(new HandleError("This page does not exist", 404))
    }

    apiFeatures.pagination(resultPerPage);
    const products = await apiFeatures.query;
    if(!products || products.length === 0){
        return next(new HandleError("Products not found", 404))
    }
    res.status(200).json({
        success: true,
        products,
        productCount,
        totalPages,
        resultPerPage,
        currentPage: page
    })
})

export const updateProduct = handleAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new HandleError("Product not found", 404));
  }

  let images = [];

  if (typeof req.body.image === "string") {
    images.push(req.body.image);
  } else if (Array.isArray(req.body.image)) {
    images = req.body.image;
  }

  let imageLinks = [];

  if (images.length > 0) {
    // delete old images
    for (let i = 0; i < product.image.length; i++) {
      await cloudinary.uploader.destroy(product.image[i].public_id);
    }

    // upload new images
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i], {
        folder: "products",
      });

      imageLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.image = imageLinks;
  } else {
    // ✅ keep old images if no new image uploaded
    req.body.image = product.image;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    product,
  });
});


// delete product
 export const deleteProduct =handleAsyncError( async(req, res , next) => {
    let product = await Product.findById(req.params.id);
    if(!product){
      if(!product){
        return next(new HandleError("Product not found", 404))
    }
    }
    // Delete Image
    for (let i = 0; i < product.image.length; i++) {
        await cloudinary.uploader.destroy(product.image[i].public_id);
    }
    product = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })
 })

 // accessing single product
 export const getProductDetails =handleAsyncError( async(req, res , next) => {
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new HandleError("Product not found", 404))
    }
    res.status(200).json({
        success: true,
        product
    })
 })


 // create review
 export const createReviewForProduct =handleAsyncError( async(req, res , next) => {
    const{rating, comment, productId} = req.body;
    // console.log(req.body);
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    const product = await Product.findById(productId);
    // console.log(product);
    if(!product){
        return next(new HandleError("Product not found", 404))
    }
    const reviewExists = product.reviews.find(review => review.user.toString() === req.user.id.toString());
    if(reviewExists){
        // update review
        product.reviews.forEach(review => {
            if(review.user.toString() === req.user.id.toString()){
                review.comment = comment;
                review.rating = rating;
            }
        })
    }else{
        product.reviews.push(review);
    }
    product.numOfReviews = product.reviews.length;
    let sum = 0 ;
    product.reviews.forEach(review => {
        sum += review.rating;
    })
    product.ratings = product.reviews.length === 0 ? 0 : sum / product.reviews.length;
    await product.save({validateBeforeSave: false});
    res.status(200).json({
        success: true,
        product
    })
 })


 // get all reviews of a product
export const getProductReviews =handleAsyncError( async(req, res , next) => {
    const product = await Product.findById(req.query.id);
    if(!product){
        return next(new HandleError("Product not found", 404))
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

// Delete Product Review
export const deleteReview = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId); //

    if (!product) {
        return next(new HandleError("Product not found", 404)); //
    }

    // 1. Filter out the specific review to delete
    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    );

    // 2. Update the number of reviews
    const numOfReviews = reviews.length;

    // 3. Calculate the new average ratings
    let avg = 0;
    if (reviews.length > 0) {
        const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
        avg = sum / reviews.length; // FIX: Divide by new length, not old
    }

    const ratings = avg;

    // 4. Update the product in the database
    await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            numOfReviews,
            ratings,
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    res.status(200).json({
        success: true,
        message: "Review deleted successfully", //
        reviews,
    });
});

 // Admin-get all products
 export const getAdminProducts =handleAsyncError( async(req, res , next) => {
     const products = await Product.find();
     res.status(200).json({
         success: true,
         products
     })
 })