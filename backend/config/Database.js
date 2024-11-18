const mongoose = require("mongoose");

const connectDatabase = () => {
  const dbURI =
    process.env.NODE_ENV === "DEVELOPMENT"
      ? process.env.DB_ATLAS_URI
      : process.env.DB_LOCAL_URI;

  mongoose
    .connect(dbURI, {})
    .then((con) => {
      console.log(`mongoDB connected to HOST: ${con.connection.host}`);
    })
    .catch((err) => {
      console.error("mongoDB connection error: ", err);
    });
};

module.exports = connectDatabase;
