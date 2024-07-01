import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { mongoDBURL } from "./config";
// import routes from user.ts
import { userRouter } from "./routes/user";
// import routes from product.ts
import { productRouter } from "./routes/product";

// instance of the express library
// will hold our api
const app = express();

// middleware
// ever time daa comes in a endpoint
// we want it in json format
app.use(express.json());
// allows us to have connection and access API from react app
app.use(cors());

// whenever we want to make a request related to user we
// make a request to "localhost:3001/user"
// In other words all end points related to user exist here
app.use("/user", userRouter);
// applying new router from product.ts
app.use("/product", productRouter);

// make a connection to mongoose database
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connect to database");
    // ONLY want express server to run if database connection is successful
    // api can start by listening to a port
    // our react will run on port 3000
    // when ever it has ran we console log message
    app.listen(3001, () => {
      console.log("Server has started!");
    });
  })
  .catch((error) => {
    console.log(error);
  });
