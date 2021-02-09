let express = require('express')
let router = express.Router()


const userSchema = require("../Schemas/user");
const slottxnSchema = require("../Schemas/slottxn");
const x3matrixSchema = require("../Schemas/x3matrix");
const x6matrixSchema = require("../Schemas/x6matrix");
const TransactionSchema = require("../Schemas/transactions");
const slotholderSchema = require("../Schemas/slotholder");
const MatrixstatSchema = require("../Schemas/matrixstat");
const txnlogSchema = require("../Schemas/txnlog");
const userstatSchema = require("../Schemas/userstat");

const dbconnect = require("../dbconnect");
let mxdb = dbconnect.getDatabaseConnection("Matrix");

const user = mxdb.model("user", userSchema);
const x3matrix = mxdb.model("x3matrix", x3matrixSchema);
const x6matrix = mxdb.model("x6matrix", x6matrixSchema);
const Matrixstat = mxdb.model("matrixstat", MatrixstatSchema);
const slottxn = mxdb.model("slottxn", slottxnSchema);
const Transactions = mxdb.model("transaction", TransactionSchema);
const slotholder = mxdb.model("slotholder", slotholderSchema);

router.get('/:UserAddress/:Matrix/:Level/:Reinvest', async (req, res) => {
    
    let founduser = await user.findOne({ address: req.params.UserAddress }).populate({ path: "referrer", model: user, select: ['address', 'id'] })
    if(req.params.Matrix === 'egr'){
        await x3matrix.findOne({ owner: req.params.UserAddress, level: Number(req.params.Level) }).populate({ path: "transactions", model: slottxn }).exec(async (e, foundx3) => {
         
            if (req.params.Reinvest === "latest") {
                let foundSlot = await slotholder.findOne({ _id: foundx3.slots[foundx3.slots.length - 1] }).populate({ path: "slotholder", model: slottxn })
                res.json({ founduser: founduser, foundslot: foundSlot, matrixobj: foundx3})
            } else {
                if (Number(req.params.Reinvest) < foundx3.slots.length && Number(req.params.Reinvest) >= 0) {
                    let foundSlot = await slotholder.findOne({ _id: foundx3.slots[Number(req.params.Reinvest)] }).populate({ path: "slotholder", model: slottxn })
                    res.json({ founduser: founduser, foundslot: foundSlot, matrixobj:foundx3 })
                } else {
                    res.send("wrong Reinvest Count")
                }
            }
        })

        
    }

    if (req.params.Matrix === 'lzy') {
        await x6matrix.findOne({ owner: req.params.UserAddress, level: Number(req.params.Level) }).populate({ path: "transactions", model: slottxn }).exec(async (e, foundx6) => {

            if (req.params.Reinvest === "latest") {
                let foundSlot = await slotholder.findOne({ _id: foundx6.slots[foundx6.slots.length - 1] }).populate({ path: "slotholder", model: slottxn })
                res.json({ founduser: founduser, foundslot: foundSlot, matrixobj: foundx6 })
            } else {
                if (Number(req.params.Reinvest) < foundx6.slots.length && Number(req.params.Reinvest) >= 0) {
                    let foundSlot = await slotholder.findOne({ _id: foundx6.slots[Number(req.params.Reinvest)] }).populate({ path: "slotholder", model: slottxn })
                    res.json({ founduser: founduser, foundslot: foundSlot, matrixobj: foundx6 })
                } else {
                    res.send("wrong Reinvest Count")
                }
            }
        })


    }
    
})





router.get('/slotsuser/:userAddress/', async (req, res) => {
    await user.findOne({ address: req.params.userAddress }).populate({ path: "referrer", model: user, select: ['address', 'id'] }).exec((e, response) => {
            if (e) {
                console.log(e)
            } else {
                sendresponse(response)
            }
        })

    let sendresponse = (data) => {
        if (data) {
            res.json(data)
        } else {
            res.json({ response: 'Not Found' })
        }

    }

})


router.get('/slotsitem/:userAddress/:matrix/:level', async (req, res) => {
    await user.findOne({ address: req.params.userAddress }).exec(async(e, response) => {
        if (e) {
            console.log(e)
        } else {
            if(req.params.matrix === 'egr'){
                let mat = await x3matrix.findOne({ owner: req.params.UserAddress, level: Number(req.params.level)})
                sendresponse(response,mat)
            } else if (req.params.matrix === 'lzy'){
                let mat = await x6matrix.findOne({ owner: req.params.UserAddress, level: Number(req.params.level) })
                sendresponse(response, mat)
            }
            
        }
    })

    let sendresponse = (data,data1) => {
        if (data) {
            res.json({id:data.id,soldspots:data1.soldspots,reinvests:data1,soldspots})
        } else {
            res.json({ response: 'Not Found' })
        }

    }

})






module.exports = router