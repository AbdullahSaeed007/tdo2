const express = require("express");
const { authorizeRoles, isAuthenticatedUser } = require("../middlewares/Auth");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logout,
  getAllUsers,
  deleteUser,
  getUser,
  updateUser,
  setPermissions,
} = require("../controller/AuthController");

router.route("/login/user").post(loginUser);
router.route("/register/user").post(registerUser);
router.route("/logout").get(logout);
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("Admin"), getAllUsers);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("Admin"), getUser)
  .put(isAuthenticatedUser, authorizeRoles("Admin"), updateUser)
  .delete(isAuthenticatedUser, authorizeRoles("Admin"), deleteUser);

router
  .route("/admin/permissions/:id")
  .put(isAuthenticatedUser, authorizeRoles("Admin"), setPermissions);

module.exports = router;
