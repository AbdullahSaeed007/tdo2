const bcrypt = require("bcryptjs");
const connectDatabase = require("../../config/Database");
const userModel = require("../../models/User");

connectDatabase();
async function createAdminUser() {
  const adminData = {
    username: "abd007",
    email: "gmsiddiquie@gmail.com",
    password: await bcrypt.hash("ali123", 10),
    role: "Admin",
    permissions: ["read", "write", "delete", "update"],
  };

  try {
    const existingAdmin = await userModel.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log("Admin user already exists.");
      return;
    }

    const adminUser = new userModel(adminData);
    await adminUser.save();
    console.log("Admin user created successfully!");
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}
createAdminUser();
