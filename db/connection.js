const mongoose = require("mongoose");

export const initDB = (callback) => {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
  });

  mongoose.connection
    .once("open", () => console.log("DB connection successfully"))
    .on("error", (error) => console.log("There was an error with the db: ", error));
};