const express = require("express");
const app = express();
const mongoos = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");

dotenv.config();

mongoos
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connection Successfull.."))
  .catch((err) => console.log(err));

app.use(express.json());

app.use("/api/auth", authRoute);

app.listen(8888, () => {
  console.log("Aditya...");
  console.log("Backend is running on 8888...");
});
