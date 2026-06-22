import React, { useEffect, useState } from "react";
import "../AdminStyles/UpdateRole.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import PageTitle from "../Components/PageTitle";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage, getSingleUser, removeError, removeSuccess, updateUserRole } from "../features/admin/adminSlice";
import { toast } from "react-toastify";
import Loader from "../Components/Loader";
function UpdateRole() {
  const { userId } = useParams();
  const { user, loading, error,success, message } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getSingleUser(userId));
  }, [dispatch, userId]);
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
      });
    }
  }, [user]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });
  const { name, email, role } = formData;
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserRole({ userId, role }));
  };

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
      navigate("/admin/users");
    }
  }, [dispatch, error, success , message]);
  return (
    <>
    {loading ? <Loader /> : (<>
      <Navbar />
      <PageTitle title="Update Role" />
      <div className="page-wrapper">
        <div className="update-user-role-container">
          <h1>Update User Role</h1>
          <form className="update-user-role-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                readOnly
                value={name}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                readOnly
                value={email}
              />
            </div>
            <div className="form-group">
              <label htmlFor="role">Role:</label>
              <select
                id="role"
                name="role"
                required
                value={role}
                onChange={handleChange}
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <button className="btn btn-primary">Update Role</button>
          </form>
        </div>
      </div>
      <Footer />
      </>)}
    </>
  );
}

export default UpdateRole;
