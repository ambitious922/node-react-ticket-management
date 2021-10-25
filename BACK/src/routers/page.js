const express = require('express')
const router =new express.Router()
const Pages = require('../models/page')
const auth = require('../middleware/authentication')

router.post('/pages', auth, async (req, res) => {
    const page = new Pages({
        //this is an object which was the req.body with the page description and completed status
        ...req.body,
        //here we are hard coding the page owner from the request auth, no need to send the name of the owner when they make a page request
        owner: req.user._id
    })
    try {
        const thePage = await page.save()
        res.status(201).send(thePage)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.post('/addblankpage/', auth, async (req, res) => {
    const newBlankPage = new Pages ({
        title: "New Page",
        details: "",
        category: "",
        pageTag: "1a",
        x: 50,
        y: 50,
        widgets: [],
        owner: req.user._id
    });
    try {
        const thePage = await newBlankPage.save();
        res.status(201).send(thePage);
    }
    catch(e){
        console.log(e);
        res.status(400).send(e)
    }
})

//remember that the skip must be a multiple of the limit, or it would be weird
router.get('/pages/',auth,async (req,res)=>{
    //const pathway = req.params.pathway
    try{
        //here can only find the page if it is one that the dude has created
        // console.log("trying to get patients from ",ward);
        const pages = await Pages.find({})
        if(!pages){
            return res.status(404).send() //I'm calling no pages a 404, there should always be pages probably
        }
        // let pagesArray = [];
        // for(let g=0;g<pages.length;g++){
        //     pagesArray.push(pages[g]);
        // }
        res.send(pages)
    }
    catch(e){
        res.status(500).send("what is going on???")
    }

})

router.post('/deletepages/:_id',auth,async (req,res) =>{
    try{
        const deletedPage = await Pages.findOneAndDelete({"_id": req.params})
        if(!deletedPage){
            return res.status(404).send()
        }
        res.send(deletedPage)
        console.log("deleted page at router")
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.post('/pageoverwrite/:_id',auth, async(req,res)=>{
    //console.log("received for pageUpdate API: ",req.body);
    const query = { "_id": req.params };
    const replacementPage = req.body;
    Pages.findOneAndReplace(query, replacementPage, null, function (err, doc) {
        if (err){
            console.log(err)
        }
        else{
            console.log("replaced successfully");
        }})
})

router.post('/pageupdate/:_id',auth, async(req,res)=>{
    //console.log("received for pageUpdate API: ",req.body);
    const filter = { "_id": req.params };
    const update = req.body;
    let updatedDoc = await Pages.findOneAndUpdate(filter, update, {new: true})
});

//THIS ROUTER ISN'T GETTING CALLED ON WIDGET UPDATE REQUEST
router.post('/pagewidget/:id',auth, async(req,res)=>{
    console.log("trying to update widget yo")
    const query = { "_id": req.params.id };
    const addedWidgets = req.body;
    try {
        const thePage = await Pages.updateOne({ query }, {
            widgets: addedWidgets
          });
        res.status(201).send(thePage)
    }
    catch(e){
        console.log(e);
        res.status(400).send(e)
    }
})

module.exports = router