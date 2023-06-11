const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");

dotenv.config();

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Connection Established"))
    .catch(() => console.log("Connection Failed"));

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);

// take port number from env (we specify it), if not present then use 3000
app.listen(process.env.PORT || 3000, ()=>{
    console.log("server is up and running!");
})