const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config({ path: "backend/config/config.env" });
}

//using middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

//importing routes
const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user");

//using routes
app.use("/app/v1", postRoutes);
app.use("/app/v1", userRoutes);

// if npm run build is used
// app.use(express.static(path.join(__dirname,"../frontend/build")));

//send the dynamic file created by react for all path
app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

module.exports = app;