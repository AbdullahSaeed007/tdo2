const taskModel = require("../models/Task");
exports.deleteTaskWithColumn = async (columnId) => {
  try {
    await taskModel.deleteMany({ colId: columnId });
  } catch (error) {
    console.log("error deleting tasks associated woth column ", error);
  }
};
