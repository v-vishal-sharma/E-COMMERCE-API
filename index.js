const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");


dotenv.config();

// Then is for successful connection and catch is for any errors that might occur.
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Database Connected"))
    .catch((err) => console.log(err));

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);

// take port number from env (we specify it), if not present then use 3000
app.listen(process.env.PORT || 3000, ()=>{
    console.log("server is up and running!");
})