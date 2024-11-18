const express = require("express");
const router = express.Router();
const columnModel = require("../models/Column");
const { deleteTaskWithColumn } = require("../utils/DeleteUtility"); //named export not default export
exports.postColumn = async (req, res) => {
  try {
    req.body.user_id = req.user.id;
    const column = await columnModel.create(req.body);
    res.status(201).json({
      success: true,
      message: "Column created successfully",
      column,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create column",
      error: error.message,
    });
  }
};

exports.getColumns = async (req, res) => {
  try {
    const userId = req.user.id;
    const columns = await columnModel.find({ user_id: userId });

    res.status(200).json({
      success: true,
      message: "Columns fetched successfully",
      count: columns.length,
      columns,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch columns",
      error: error.message,
    });
  }
};

exports.deleteColumn = async (req, res) => {
  try {
    const column = await columnModel.findById(req.params.id);
    if (!column) {
      return res.status(404).json({
        success: false,
        message: "column not found",
      });
    }
    await deleteTaskWithColumn(req.params.id);
    await column.deleteOne();
    res.status(200).json({
      success: true,
      message: "column successfully deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete columns",
      error: error.message,
    });
  }
};
