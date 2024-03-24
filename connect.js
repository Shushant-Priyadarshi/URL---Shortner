const mongoose =require("mongoose");

async function connectToMongoose(url){
    return mongoose.connect(url);
}

module.exports={
    connectToMongoose,
}