import instantRoutes from "./routes/instantRoutes";
import express from "express";
import cors from "cors";
// const  authToken  = require('./helper/authToken')
const config = require("./config/firebase-config");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// app.use(authToken.decodedToken)

app.use("/instant", instantRoutes.routes);

app.listen(config.port, () => {
  console.log("Listening on port 5000");
});
