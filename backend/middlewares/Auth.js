const jwt = require("jsonwebtoken");
const userModel = require("../models/User");
const columnModel = require("../models/Column");
const taskModel = require("../models/Task");

exports.isAuthenticatedUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please log in first to access this resource",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await userModel.findById(decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token, please log in again",
    });
  }
};
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        success: false,
        message: `Role (${req.user.role}) is not allowed to access this resource`,
      });
    }
    next();
  };
};

exports.checkPermissions = (...routePermissions) => {
  return async (req, res, next) => {
    try {
      const permissions = req.user.permissions;
      if (!permissions) {
        return res.status(404).json({
          success: false,
          message: "user dont have any permissions",
        });
      }
      if (routePermissions.includes("getColumn")) {
        const getPermission = "read";
        if (!req.user.permissions.includes(getPermission)) {
          return res.status(401).json({
            status: false,
            message:
              "unAuthorized access, You Are Not allowed To Access It by Admin",
          });
        }
      } else if (routePermissions.includes("deleteColumn")) {
        const deletePermission = "delete";
        if (!req.user.permissions.includes(deletePermission)) {
          return res.status(401).json({
            status: false,
            message:
              "unAuthorized access, You Are Not allowed To Access It by Admin",
          });
        }
      } else if (routePermissions.includes("PostColumn")) {
        const writePermission = "write";
        if (!req.user.permissions.includes(writePermission)) {
          return res.status(401).json({
            status: false,
            message:
              "unAuthorized access, You Are Not allowed To Access It by Admin",
          });
        }
      } else if (routePermissions.includes("taskPost")) {
        const writePermission = "write";
        if (!req.user.permissions.includes(writePermission)) {
          return res.status(401).json({
            status: false,
            message:
              "unAuthorized access, You Are Not allowed To Access It by Admin",
          });
        }
      } else if (routePermissions.includes("getTask")) {
        const writePermission = "read";
        if (!req.user.permissions.includes(writePermission)) {
          return res.status(401).json({
            status: false,
            message:
              "unAuthorized access, You Are Not allowed To Access It by Admin",
          });
        }
      } else if (routePermissions.includes("taskDelete")) {
        const writePermission = "delete";
        if (!req.user.permissions.includes(writePermission)) {
          return res.status(401).json({
            status: false,
            message:
              "unAuthorized access, You Are Not allowed To Access It by Admin",
          });
        }
      }
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  };
};

exports.validateUser = (...reqFrom) => {
  return async (req, res, next) => {
    try {
      const { token } = req.cookies;
      if (!token) {
        return res.status(404).json({
          success: false,
          message: "Token not found",
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (reqFrom.includes("columnDelete")) {
        const column = await columnModel.findById(req.params.id);
        if (!column) {
          return res.status(404).json({
            success: false,
            message: "Column not found",
          });
        }
        const columnUserId = column.user_id;
        if (!columnUserId.equals(user._id)) {
          return res.status(401).json({
            success: false,
            message: "Unauthorized access detected",
          });
        }
      } else if (reqFrom.includes("taskPost")) {
        const col_Id = req.body.colId;
        const column = await columnModel.findOne({ _id: col_Id });
        const columnUserId = column.user_id;

        if (!columnUserId.equals(user._id)) {
          return res.status(401).json({
            success: false,
            message: "Unauthorized access detected",
          });
        }
      } else if (reqFrom.includes("taskDelete")) {
        const taskId = req.params.id;
        const task = await taskModel.findOne({ _id: taskId });
        const columnId = task.colId;
        const column = await columnModel.findOne({ _id: columnId });
        const userIdColumn = column.user_id;
        if (!userIdColumn.equals(user._id)) {
          return res.status(401).json({
            success: false,
            message: "Unauthorized access detected",
          });
        }
      }
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  };
};
