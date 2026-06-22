import React, { useEffect } from "react";
import "../AdminStyles/OrdersList.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import PageTitle from "../Components/PageTitle";
import { Link } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  clearMessage,
  deleteOrder,
  fetchAllOrders,
  removeError,
  removeSuccess,
} from "../features/admin/adminSlice";
import { toast } from "react-toastify";
import Loader from "../Components/Loader";

function OrdersList() {
  const { orders, loading, error, success, message } = useSelector(
    (state) => state.admin
  );

  const dispatch = useDispatch();

  /* ===== FETCH ORDERS ON LOAD ===== */
  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  /* ===== ERROR + SUCCESS HANDLER ===== */
  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      dispatch(removeError());
    }

    if (success) {
      toast.success(message, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      dispatch(removeSuccess());
      dispatch(clearMessage());
      dispatch(fetchAllOrders());
    }
  }, [dispatch, error, success, message]);

  /* ===== DELETE ORDER ===== */
  const handleDelete = (orderId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );
    if (isConfirmed) {
      dispatch(deleteOrder(orderId));
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Navbar />
          <PageTitle title="Orders List" />

          <div className="ordersList-container">
            <h1 className="ordersList-title">All Orders</h1>

            {orders && orders.length === 0 && (
              <div className="no-orders-container">No Orders Found</div>
            )}

            <div className="ordersList-table-container">
              <table className="ordersList-table">
                <thead>
                  <tr>
                    <th>Sl No</th>
                    <th>Order Id</th>
                    <th>Status</th>
                    <th>Total Price</th>
                    <th>Number Of Items</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {orders &&
                    orders.map((order, index) => (
                      <tr key={order._id}>
                        <td>{index + 1}</td>
                        <td>{order._id}</td>

                        <td
                          className={`order-status ${
                            (order.orderStatus || "").toLowerCase()
                          }`}
                        >
                          {order.orderStatus || "N/A"}
                        </td>

                        <td>
                          {order.totalPrice
                            ? order.totalPrice.toFixed(2)
                            : "0.00"}
                          /-
                        </td>

                        <td>{order.orderItems?.length || 0}</td>

                        <td>
                          <Link
                            to={`/admin/order/${order._id}`}
                            className="action-icon edit-icon"
                          >
                            <Edit />
                          </Link>

                          <button
                            className="action-icon delete-icon"
                            onClick={() => handleDelete(order._id)}
                          >
                            <Delete />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <Footer />
        </>
      )}
    </>
  );
}

export default OrdersList;
