const express = require("express");
const router = express.Router();
const taskModel = require("../models/Task");
const columnModel = require("../models/Column");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");

exports.postTask = async (req, res) => {
  try {
    //req.body.user_id=req.user.id;
    const col_Id = req.body.colId;
    const colIdTasks = await taskModel.find({ colId: col_Id });
    const max = colIdTasks.reduce(
      (max, value) => Math.max(max, value.taskOrder),
      -1
    );

    req.body.taskOrder = max + 1;

    // Check if a file was uploaded and assign the file path to req.body
    if (req.file) {
      req.body.image = `/public/uploads/${req.file.filename}`; // Store the file URL relative to public folder
    }

    const task = await taskModel.create(req.body);
    res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to post task",
      error: error.message,
    });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const columns = await columnModel.find({ user_id: userId });

    if (!columns.length) {
      return res.status(404).json({
        success: false,
        message: "No columns found for this user",
      });
    }

    const tasksByColumn = await Promise.all(
      columns.map(async (column) => {
        const tasks = await taskModel
          .find({ colId: column._id })
          .sort({ taskOrder: 1 });
        return { columnId: column._id, columnName: column.columnName, tasks };
      })
    );

    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      tasksByColumn,
    });
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await taskModel.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (task.image) {
      const imageFileName = path.basename(task.image);
      const imagePath = path.join(
        __dirname,
        "..",
        "public",
        "uploads",
        imageFileName
      );

      try {
        fs.unlinkSync(imagePath);
      } catch (err) {
        console.error("Error deleting image:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to delete the image associated with the task",
        });
      }
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: "Task and associated image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete task",
      error: error.message,
    });
  }
};

exports.updateTask = async (req, res, next) => {
  const { targetColumn, targetOrder, taskToMoveId } = req.body;

  try {
    const taskToMove = await taskModel.findById(taskToMoveId);
    if (!taskToMove) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    const originalColumn = taskToMove.colId;
    const originalOrder = taskToMove.taskOrder;

    await taskModel.updateMany(
      {
        colId: originalColumn,
        taskOrder: { $gt: originalOrder },
      },
      { $inc: { taskOrder: -1 } }
    );

    await taskModel.updateMany(
      {
        colId: targetColumn,
        taskOrder: { $gte: targetOrder },
      },
      { $inc: { taskOrder: 1 } }
    );

    taskToMove.colId = targetColumn;
    taskToMove.taskOrder = targetOrder;
    await taskToMove.save();

    const tasks = await taskModel.find().sort({ colId: 1, taskOrder: 1 });
    const tasksByColumn = tasks.reduce((acc, task) => {
      const colId = task.colId.toString();
      if (!acc[colId]) {
        acc[colId] = { columnId: colId, columnName: "", tasks: [] };
      }
      acc[colId].tasks.push(task);
      return acc;
    }, {});

    const tasksByColumnArray = Object.values(tasksByColumn);

    return res.status(200).json({
      success: true,
      message: "Task moved and reordered successfully",
      tasksByColumn: tasksByColumnArray,
    });
  } catch (error) {
    console.error("Error updating task order:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
