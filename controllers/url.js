const shortID = require('shortid');
const URL =require("../models/url");

async function handleGenerateShortUrl(req,res){
    const body =req.body;
    if(!body.url) return res.status(400).json({error:"URL IS REQUIRED!"});

    const shortId = shortID.generate(8);

    await URL.create({
        shortId:shortId,
        redirectUrl:body.url,
        visitHistory:[],
    });

    return res.render("home",{
        id:shortId
    })
    // return res.json({id:shortId});
};

async function handleGetAnalytics(req, res) {
    try {
        const shortId = req.params.shortID;
        const result = await URL.findOne({ shortId });

        if (!result) {
            return res.status(404).json({ error: "URL not found" });
        }

        return res.json({
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports={
    handleGenerateShortUrl,handleGetAnalytics
}