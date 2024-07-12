const mongoose = require("mongoose");
const festSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,

    },
    Activity:{
        type: String,
        
    },
    email:{
        type: String,
        required:true,
    },
    phone:{
        type:String,
        required:true,

    },
  
    created:{
        type:Date,
        required:true,
        default:Date.now,
    },
});
module.exports = mongoose.model('Fest',festSchema);