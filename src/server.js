import express from "express";
import listEndpoints from "express-list-endpoints";
import { join } from "path";

import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./index.js";
const server = express();
const port = process.env.PORT || 3001;

server.use(cors());
const publicFolderPath = join(process.cwd(), "public");
console.log("public folder path", publicFolderPath);

server.use(express.static(publicFolderPath));
server.use(express.json());
server.use("/users", userRouter);
server.use(listEndpoints);
mongoose.connect(process.env.MONGO_CONNECTION);
mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server running on port ${port}`);
  });
});
mongoose.connection.on("error", (err) => {
  console.log(`❌ Server is not running due to :${err}`);
});
