const { Schema, model } = require("mongoose");

const taskSchema = new Schema({
  taskName: {
    type: String,
    required: true,
  },
  taskDescription: {
    type: String,
    required: true,
  },
  taskOrder: {
    type: Number,
    required: true,
  },
  image:{
    type:String,
    required:false,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
  colId: {
    type: Schema.Types.ObjectId,
    ref: "columnModel",
    required: true,
  },
});

const taskModel = model("taskModel", taskSchema);
module.exports = taskModel;
