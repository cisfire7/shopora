import React, { useEffect, useState } from "react";
import "../pageStyles/ProductDetails.css";
import PageTitle from "../Components/PageTitle";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Rating from "../Components/Rating";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "../Components/Loader";
import { toast } from "react-toastify";

// Product slice imports
import {
  createReview,
  getProductDetails,
  removeError as removeProductError,
  removeSuccess,
} from "../features/products/productSlice";

// Cart slice imports
import {
  addItemsToCart,
  removeMessage,
  removeError as removeCartError,
} from "../features/cart/cartSlice";

function ProductDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [quantity, setQuantity] = useState(1);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  const { loading, error, product, reviewSuccess, reviewLoading } = useSelector(
    (state) => state.product,
  );
  const {
    loading: cartLoading,
    error: cartError,
    success,
    message,
  } = useSelector((state) => state.cart);

  const increaseQuantity = () => {
    if (product.stock <= quantity) {
      toast.error("Cannot exceed available stock", {
        position: "top-center",
        theme: "dark",
      });
      return;
    }
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity <= 1) {
      toast.error("Minimum quantity is 1", {
        position: "top-center",
        theme: "dark",
      });
      return;
    }
    setQuantity((prev) => prev - 1);
  };
  
useEffect(() => {
  if (Array.isArray(product?.image) && product.image.length > 0) {
    setSelectedImage(product.image[0].url.replace("./", "/"));
  }
}, [product]);

  const handleRatingChange = (newRating) => {
    setUserRating(newRating);
  };

  const addToCart = () => {
    dispatch(addItemsToCart({ id, quantity }));
  };

  // Fetch product
  useEffect(() => {
    if (id) {
      dispatch(getProductDetails(id));
    }
  }, [dispatch, id]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      dispatch(removeProductError());
    }
    if (cartError) {
      toast.error(cartError, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      dispatch(removeCartError());
    }
  }, [dispatch, error, cartError]);

  // Handle cart success
  useEffect(() => {
    if (success) {
      toast.success(message, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      dispatch(removeMessage());
    }
  }, [dispatch, success, message]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();

    if (!userRating) {
      toast.error("Please select a rating", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    dispatch(createReview({ rating: userRating, comment, productId: id }));
  };

  // Review success
  useEffect(() => {
    if (reviewSuccess) {
      toast.success("Review submitted successfully", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      setUserRating(0);
      setComment("");
      dispatch(removeSuccess());
      dispatch(getProductDetails(id));
    }
  }, [reviewSuccess, dispatch, id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader />
        <Footer />
      </>
    );
  }

  if (!product) return null;

  return (
    <>
      <PageTitle title={product.name} />
      <Navbar />

      <div className="product-details-container">
        <div className="product-detail-container">
          <div className="product-image-container">
            <img
              src={
                selectedImage || "/placeholder.jpg"
              }
              alt={product.name}
              className="product-detail-image"
            />
          {Array.isArray(product?.image) && product.image.length > 1 && (
  <div className="product-thumbnails">
    {product.image.map((img, index) => (
      <img
        key={index}
        src={img.url.replace("./", "/")}
        alt="Thumbnail"
        className="thumbnail-image"
        onClick={() =>
          setSelectedImage(img.url.replace("./", "/"))
        }
      />
    ))}
  </div>
)}

          </div>

          <div className="product-info">
            <h2>{product.name}</h2>
            <h2 className="product-description">{product.description}</h2>
            <p className="product-price">Price: ₹{product.price}</p>

            <div className="product-rating">
              <Rating value={product.ratings || 0} disabled={true} />
              <span className="productCardSpan">
                ({product.numOfReviews || 0}{" "}
                {product.numOfReviews === 1 ? "Review" : "Reviews"})
              </span>
            </div>

            <div className="stock-status">
              <span className={product.stock > 0 ? "in-stock" : "out-of-stock"}>
                {product.stock > 0
                  ? `In Stock: ${product.stock} Available`
                  : "Out of Stock"}
              </span>
            </div>

            {product.stock > 0 && (
              <>
                <div className="quantity-controls">
                  <span className="quantity-label">Quantity: </span>
                  <button
                    className="quantity-button"
                    onClick={decreaseQuantity}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="quantity-value"
                    value={quantity}
                    readOnly
                  />
                  <button
                    className="quantity-button"
                    onClick={increaseQuantity}
                  >
                    +
                  </button>
                </div>

                <button
                  className="add-to-cart-btn"
                  onClick={addToCart}
                  disabled={cartLoading}
                >
                  {cartLoading ? "Adding..." : "Add to Cart"}
                </button>
              </>
            )}

            <form className="review-form" onSubmit={handleReviewSubmit}>
              <h3>Write a Review</h3>

              <Rating
                value={userRating}
                disabled={false}
                onRatingChange={handleRatingChange}
              />

              <textarea
                className="review-input"
                placeholder="Write your Valuable Review here.."
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <button className="submit-review-btn" disabled={reviewLoading}>
                {reviewLoading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>

        {product.reviews && product.reviews.length > 0 ? (
          <div className="review-container">
            <h2>Customer Reviews</h2>
            <div className="reviews-section">
              {product.reviews.map((review, index) => (
                <div className="review-item" key={index}>
                  <div className="review-header">
                    <Rating value={review.rating} disabled={true} />
                    <p className="review-comment">{review.comment}</p>
                    <p className="review-name">By: {review.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="no-reviews">
            No Reviews yet. Be the first to leave one!
          </p>
        )}
      </div>

      <Footer />
    </>
  );
}

export default ProductDetails;
