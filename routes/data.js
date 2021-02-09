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
const txnstat = mxdb.model("txnlog", txnlogSchema);
const userstat = mxdb.model("userstat", userstatSchema);
const slottxn = mxdb.model("slottxn", slottxnSchema);
const Transactions = mxdb.model("transaction", TransactionSchema);
const slotholder = mxdb.model("slotholder", slotholderSchema);



router.get('/sidepanel', async (req, res) => {
    let MatrixObj = await Matrixstat.findOne({ ide: 'genesis' })
    if (MatrixObj) {
        res.json(MatrixObj)
    } else {
        res.send({resp:'Not Found'})
    }
})

router.get('/topbar/:UserAddress', async (req, res) => {
    let Founduser = await user.findOne({ address: req.params.UserAddress })
    if (Founduser) {
        res.json(Founduser)
    } else {
        res.send({resp:'Not Found'})
    }
})

module.exports = router