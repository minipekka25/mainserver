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


router.get('/:useraddress/', async (req, res) => {


    let type = req.query.type
    let txn = req.query.txn
    let skip = req.query.skip

    if(type==='0'&&txn==='0'){
        await user.findOne({ address: req.params.useraddress }).populate({
            path: "transactions", model: slottxn, options: {
                sort: { createdAt: -1 },
                skip: Number(skip),
                limit: 10
            }
        }).exec(async (e, foundtxn) => {
            sendresponse(foundtxn)
        })
    }
        if(type!=='0'){
            let intype
            if(type ==='soldplace'){
                intype = [{ txntype: { $eq: 'soldplace' } }, { txntype: { $eq: 'soldplace|slippagezero' } }, { txntype: { $eq: 'soldplace|slippagedown' } }, { txntype: { $eq: 'slippagesuperior|slippageup' } }, { txntype: { $eq: 'soldplace|slippagedown' } }]
            }else if(type ==='reinvest'){
                intype = [{ txntype: { $eq: 'reinvest' } }, { txntype: { $eq: 'reinvest|slippagezero' } }, { txntype: { $eq: 'reinvest|slippagedown' } }]
            }else if(type === 'gift'){
                intype = [{ txntype: { $eq: 'gift' } }]
            }else if(type === 'loss'){
                intype = [{ txntype: { $eq: 'loss' } }]
            } else if (type === 'slippagesuperior'){
                intype = [{ txntype: { $eq: 'slippagesuperior|slippagezero' } }, { txntype: { $eq: 'slippagesuperior|slippageup' } }]
            } else if(type === 'slippageup'){
                intype = [{ txntype: { $eq: 'slippagesuperior|slippageup' } }]
            } else if(type === 'slippagedown'){
                intype = [{ txntype: { $eq: 'soldplace|slippagedown' } }, { txntype: { $eq: 'reinvest|slippagedown' } }]
            }
            await user.findOne({ address: req.params.useraddress }).populate({
                path: "transactions", model: slottxn, match: { $or: intype }, options: {
                    sort: { createdAt: -1 },
                    skip: Number(skip),
                    limit: 10
                }
            }).exec(async (e, foundtxn) => {
                sendresponse(foundtxn)
            })
        }else if(txn !== '0'){
            await user.findOne({ address: req.params.useraddress }).populate({
                path: "transactions", model: slottxn, match: { transactionId: { $eq: txn } }, options: {
                    sort: { createdAt: -1 },
                    skip: Number(skip),
                    limit: 10
                }
            }).exec(async (e, foundtxn) => {
                sendresponse(foundtxn)
            })
        }
    

    let sendresponse = (data) => {
        if (data) {
            res.json(data.transactions)
        } else {
            res.json({ response: 'Not Found' })
        }

    }

    
    

})



module.exports = router