let express = require('express')
let router = express.Router()

const userSchema = require("../Schemas/user");
const userstatSchema = require("../Schemas/userstat");

const dbconnect = require("../dbconnect");
let mxdb = dbconnect.getDatabaseConnection("Matrix");

const user = mxdb.model("user", userSchema);
const userstat = mxdb.model("userstat", userstatSchema);



router.get('/:UserAddress', async (req, res) => {
    let FoundUser = await user.findOne({ address: req.params.UserAddress })
    if (FoundUser) {
        res.json({response:"User Found",address:FoundUser.address})
    } else {
        let FoundUserStat = await userstat.findOne({ address: req.params.UserAddress })
        if (FoundUserStat){
            res.json({ response:"User Processing"})
        }else{
            res.json({ response:"User Not Found"})
        }
        }
})

router.get('/referrer/:id', async (req, res) => {
    let FoundUser = await user.findOne({ id: req.params.id })
    if (FoundUser) {
        res.json({ response: "User Found", address: FoundUser.address })
    } else {
        let FoundUserStat = await userstat.findOne({ address: req.params.UserAddress })
        if (FoundUserStat) {
            res.json({ response: "User Processing" })
        } else {
            res.json({ response: "User Not Found" })
        }
    }
})


module.exports = router