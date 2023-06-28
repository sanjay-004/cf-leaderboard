const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
    username : {
        type: String, 
        required: [true, "Please add the username"],
        },
    rating : {
        type : Number,
        required: [true, "Please add the rating"],
        },
    rank : {
        type : String,
        required: [true, "Please add the rank"],
        },
    },
    {
        timestamps : true,
    },
);

module.exports = mongoose.model("user",userSchema);