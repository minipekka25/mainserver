let express = require('express')
let router = express.Router()

const Web3 = require('../contract-config')
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


router.get('/:useraddress/', async (req, res) => {

    await user.findOne({ address: req.params.useraddress }).populate({
        path: "transactions", model: slottxn, match: { $or: [{ txntype: { $eq: 'registered' } }, { txntype: { $eq: 'upgrade' } }] }
            }).exec(async (e, foundtxn) => {
                sendresponse(foundtxn)
            })
    



   let sendresponse = (data) => {
        if (data) {
            res.json(data.transactions)
        } else {
            res.json({ response: 'Not Found' })
        }

    }
})

module.exports = router