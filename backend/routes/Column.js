const express = require("express");
const {
  isAuthenticatedUser,
  validateUser,
  checkPermissions,
} = require("../middlewares/Auth.js");
const router = express.Router();
const {
  getColumns,
  postColumn,
  deleteColumn,
} = require("../controller/ColumnController.js");

router
  .route("/column")
  .get(isAuthenticatedUser, checkPermissions("getColumn"), getColumns);
router
  .route("/column/delete/:id")
  .delete(
    isAuthenticatedUser,
    checkPermissions("deleteColumn"),
    validateUser("columnDelete"),
    deleteColumn
  );
router
  .route("/column/post")
  .post(isAuthenticatedUser, checkPermissions("PostColumn"), postColumn);

module.exports = router;
