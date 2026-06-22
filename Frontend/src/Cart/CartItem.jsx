import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { addItemsToCart, removeError, removeItemFromCart, removeMessage } from '../features/cart/cartSlice';
import { useDispatch, useSelector } from 'react-redux';

function CartItem({item}) {
  console.log(item);

  const {loading, error, success, message , cartItems} = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(item.quantity);
      const increaseQuantity = () => {
          if (item.stock <= quantity) {
              toast.error("Cannot exceed available stock", { position: 'top-center', theme: "dark" });
              dispatch(removeError());
              return;
          }
          setQuantity(prev => prev + 1);
      };
  
      const decreaseQuantity = () => {
          if (quantity <= 1) {
              toast.error("Minimum quantity is 1", { position: 'top-center', theme: "dark" });
              dispatch(removeError());
              return;
          }
          setQuantity(prev => prev - 1);
      };

      const handleUpdate = () => {
        if(loading){
            return ;
        }
        if(quantity !== item.quantity){
            dispatch(addItemsToCart({ id: item.product, quantity }));
        }
      };

      useEffect(() => {
        if(success){
            toast.success(message, { position: 'top-center', theme: "dark" , toastId: "updateCart" });
            dispatch(removeMessage());
        }
      },[success , message , dispatch]);

      const handleRemove = () => {
        if(loading){
            return ;
        }
        dispatch(removeItemFromCart(item.product));
        toast.success("Product removed from cart", { position: 'top-center', theme: "dark" , toastId: "removeCart" });
      };

  return (
 <div className="cart-item">
                    <div className="item-info">
                        <img src={item.image} alt={item.name} className="item-image" />
                        <div className="item-details">
                            <h3 className="item-name">{item.name}</h3>
                            <p className="item-price"><strong>Price :</strong>{item.price.toFixed(2)}/-</p>
                            <p className="item-quantity"><strong>Quantity :</strong>{item.quantity}</p>
                        </div>
                    </div>

                    <div className="quantity-controls">
                        <button className="quantity-button decrease-btn" onClick={decreaseQuantity} disabled={loading}>-</button>
                        <input type="number" className="quantity-input" value={quantity} readOnly/>
                        <button className="quantity-button increase-btn" onClick={increaseQuantity} disabled={loading} >+</button>
                    </div>

                    <div className="item-total">
                        <span className="item-total-price">{(item.price * quantity).toFixed(2)}/-</span>
                    </div>

                    <div className="item-actions">
                        <button className="update-item-btn" onClick={handleUpdate} disabled={loading || quantity === item.quantity}>{loading ? "Updating..." : "Update"}</button>
                        <button className="remove-item-btn" onClick={handleRemove} disabled={loading}>Remove</button>
                    </div>
                </div>
  )
}

export default CartItem