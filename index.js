const express = require("express");
const path =require("path");
const app =express();
const urlRoutes =require("./routes/url");

const staticRouter = require("./routes/staticRouters");
const URL = require("./models/url");

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

const {connectToMongoose   } =require("./connect");
connectToMongoose("mongodb://127.0.0.1:27017/shortUrl").then(()=>{
    console.log("MONGODB CONNECTED!");
}).catch((err)=>{
    console.log(`ERROR: ${err}`);
});
const Port =3002;

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use("/url",urlRoutes);
app.use("/",staticRouter);


app.get("/:shortId",async(req,res)=>{
    const shortId =req.params.shortId;
    try {
        const entry = await URL.findOneAndUpdate({
            shortId
        }, {
            $push: {
                visitHistory: {
                    timestamps: Date.now(),
                }
            }
        });
        if (entry) {
            res.redirect(entry.redirectUrl);
        } else {
            
            res.status(404).send("URL not found");
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});








app.listen(Port,()=>{
    console.log(`SERVER STARTED AT PORT : ${Port}`);
})