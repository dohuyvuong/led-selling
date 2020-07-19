import mongoose from "mongoose";

/**
 * Connect to MongoDB
 */
let connectDB = () => {
  let URI = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

  return mongoose
    .connect(URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(
      () => {
        console.log("Connected to db: %s", URI);
      },
      (error) => {
        console.log("Failed to connect to db!");
      }
    );
};

export default connectDB;
