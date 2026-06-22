import React, { useEffect, useState } from "react";
import "../AdminStyles/UpdateOrder.css";
import Navbar from "../Components/Navbar";
import PageTitle from "../Components/PageTitle";
import Footer from "../Components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { 
  fetchAllOrders, // If needed
  adminUpdateOrderStatus, 
  removeSuccess, 
  removeError, 
  getAdminOrderDetails
} from "../features/admin/adminSlice"; // Use adminSlice instead of orderSlice
import Loader from "../Components/Loader";
import { toast } from "react-toastify";

function UpdateOrder() {
  const [status, setStatus] = useState("");
const { order, loading, success, error } = useSelector((state) => state.admin);

  const dispatch = useDispatch();
  const { orderId } = useParams();
  console.log(orderId);

  /* ================= FETCH ORDER ================= */
  useEffect(() => {
  if (orderId) {
    dispatch(getAdminOrderDetails(orderId)); // Use the admin-specific fetch
  }
}, [dispatch, orderId]);

  /* ================= SET DEFAULT STATUS ================= */
  useEffect(() => {
    if (order?.orderStatus) {
      setStatus(order.orderStatus.toLowerCase());
    }
  }, [order]);

  /* ================= TOAST HANDLING ================= */
  useEffect(() => {
    if (success) {
      toast.success("Order status updated successfully", {
        position: "top-center",
        theme: "dark",
      });
      dispatch(removeSuccess());
    }

    if (error) {
      toast.error(error, {
        position: "top-center",
        theme: "dark",
      });
      dispatch(removeError());
    }
  }, [success, error, dispatch]);

  /* ================= UPDATE STATUS ================= */
const handleUpdateStatus = () => {
  if (!status) {
    return toast.error("Please select a status", {
      position: "top-center",
      theme: "dark",
    });
  }

  dispatch(adminUpdateOrderStatus({ orderId, status }));
};

  /* ================= SAFE DESTRUCTURING ================= */
  const {
    shippingInfo = {},
    orderItems = [],
    paymentInfo = {},
    orderStatus,
    totalPrice,
  } = order || {};
  console.log(shippingInfo);
  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <PageTitle title="Update Order Status" />

      <div className="order-container">
        <h1 className="order-title">Update Order Status</h1>

        {/* ===== ORDER DETAILS ===== */}
        <div className="order-details">
          <h2>Order Details</h2>

          <p>
            <strong>Order Id :</strong> {orderId}
          </p>

          <p>
            <strong>Shipping Address :</strong>{shippingInfo.address} , {shippingInfo.city},{" "}
            {shippingInfo.state}, {shippingInfo.country} - {" "}
            {shippingInfo.pinCode}
          </p>

          <p>
            <strong>Phone :</strong> {shippingInfo.phoneNo}
          </p>

          <p>
            <strong>Order Status :</strong> {orderStatus}
          </p>

          <p>
            <strong>Payment Status :</strong> {paymentInfo?.status}
          </p>

          <p>
            <strong>Total Price :</strong> ₹{totalPrice}
          </p>
        </div>

        {/* ===== ORDER ITEMS ===== */}
        <div className="order-items">
          <h2>Order Items</h2>

          <table className="order-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>

            <tbody>
              {orderItems && orderItems.length > 0 ? (
                orderItems.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="order-item-image"
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No Order Items
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===== UPDATE STATUS ===== */}
        <div className="order-status">
          <h2>Update Order Status</h2>

          <select
            className="status-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={orderStatus === "Delivered"}
          >
            <option value="">Select Status</option>
            <option value="shipped">Shipped</option>
            <option value="on the way">On The Way</option>
            <option value="delivered">Delivered</option>
          </select>

          <button
            className="update-button"
            onClick={handleUpdateStatus}
            disabled={orderStatus === "Delivered"}
          >
            Update Status
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default UpdateOrder;
