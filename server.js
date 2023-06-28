const express = require("express");
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");

const app = express();

const port = process.env.PORT || 5000;

connectDb();
//middleware - to parse the incoming data from client
app.use(express.json());
//middleware - routes the requests 
app.use("/api/leaderboard", require("./routes/leaderboardRoutes"));
//middleware - error handler 
app.use(errorHandler);

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});