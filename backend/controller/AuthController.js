const userModel = require("../models/User");
const sendToken = require("../utils/JwtToken");

exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const existEmail = await userModel.findOne({ email });
    const existUsername = await userModel.findOne({ username });
    if (existEmail || existUsername) {
      return res.status(200).json({
        success: false,
        message: "username or email already exist",
      });
    }
    const user = await userModel.create({
      username,
      email,
      password,
    });
    sendToken(user, 200, res);
  } catch (error) {
    console.error("Error registering the user:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while registering the user",
      error: error.message,
    });
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "enter email or password",
      });
    }

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "email or password not found",
      });
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!user || !isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "email or password is incorrect",
      });
    }
    sendToken(user, 200, res);
  } catch (error) {
    console.error("Error logging in the user:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while logging in the user",
      error: error.message,
    });
  }
};

exports.logout = async (req, res, next) => {
  try {
    const options = {
      expires: new Date(Date.now()),
      httpOnly: true,
    };
    res.cookie("token", null, options);

    res.status(200).json({
      success: true,
      message: "logout",
    });
  } catch (error) {
    console.error("Error logging out the user:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred logging out the user",
      error: error.message,
    });
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userModel.find();

    if (!users) {
      return res.status(404).json({
        success: false,
        message: "Users not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "admin permitted only (fetched)",
      users,
    });
  } catch (error) {
    console.error("Error getting all the users:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while getting all users",
      error: error.message,
    });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      res.status(404).json({
        status: false,
        message: "user not Found",
      });
    }
    console.log(user);
    res.status(200).json({
      status: true,
      message: "user Found (admin)",
      user,
    });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while getting the user",
      error: error.message,
    });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const newUserData = {
      username: req.body.username,
      email: req.body.email,
      role: req.body.role,
    };

    const user = await userModel.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Updated Successfully (admin)",
    });
  } catch (error) {
    console.error("Error updating user (admin):", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the user (admin)",
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found (Admin)",
      });
    }
    await user.deleteOne();
    res.status(200).json({
      success: true,
      message: "successfully deleted",
    });
  } catch (error) {
    console.error("Error deleting the user:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the user",
      error: error.message,
    });
  }
};

exports.setPermissions = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: true,
        message: "No User Found (setPermissionDenied)",
      });
    }
    const { permissions } = req.body;
    const allowedPermissions = ["read", "write", "delete", "update"];
    const isValid =
      Array.isArray(permissions) &&
      permissions.every((permission) =>
        allowedPermissions.includes(permission)
      );

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid permissions. Allowed values are: 'read', 'write', 'delete' and 'update'",
      });
    }

    user.permissions = permissions;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Permissions updated successfully.",
      data: user.permissions,
    });
  } catch (error) {
    console.error("Error in setting permissions:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while setting the permissions ",
      error: error.message,
    });
  }
};
