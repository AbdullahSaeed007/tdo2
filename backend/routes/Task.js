const express = require("express");
const upload = require("../middlewares/upload.js");
const {
  isAuthenticatedUser,
  validateUser,
  checkPermissions,
} = require("../middlewares/Auth.js");
const router = express.Router();
const {
  getTasks,
  postTask,
  deleteTask,
  updateTask,
} = require("../controller/TaskController.js");
router
  .route("/task/get")
  .get(isAuthenticatedUser, checkPermissions("getTask"), getTasks);
router
  .route("/task/post")
  .post(
    upload.single("image"),
    isAuthenticatedUser,
    checkPermissions("taskPost"),
    validateUser("taskPost"),
    postTask
  );
router.route("/task/drag/event").post(isAuthenticatedUser, updateTask);
router
  .route("/task/delete/:id")
  .delete(
    isAuthenticatedUser,
    checkPermissions("taskDelete"),
    validateUser("taskDelete"),
    deleteTask
  );
module.exports = router;
