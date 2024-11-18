const { Schema, model } = require("mongoose");

const columnSchema = new Schema({
  columnName: {
    type: String,
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "userModel",
    required: true,
  },
});

const columnModel = model("columnModel", columnSchema);
module.exports = columnModel;
