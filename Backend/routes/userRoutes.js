import express, { request } from "express";
import { deleteUser, getSingleUser, getUserDetails, getUsersList, loginUser, logoutUser, registerUser , requestPasswordReset, resetPassword, updatePassword, updateProfile, updateUserRole} from "../controllers/userController.js";
import { get } from "http";
import { roleBasedAcces, verifyUserAuth } from "../middleware/userAuth.js";
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/forgot/password").post(requestPasswordReset);
router.route("/reset/:token").put(resetPassword);
router.route("/profile").get(verifyUserAuth,getUserDetails);
router.route("/password/update").put(verifyUserAuth,updatePassword);
router.route("/profile/update").put(verifyUserAuth,updateProfile);
router.route("/admin/users").get(verifyUserAuth,roleBasedAcces("admin"), getUsersList);
router.route("/admin/user/:id").get(verifyUserAuth,roleBasedAcces("admin"), getSingleUser)
                               .put(verifyUserAuth,roleBasedAcces("admin"),updateUserRole)
                               .delete(verifyUserAuth,roleBasedAcces("admin"),deleteUser);

 
export default router;