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
    console.log(req.query.refid)
    let matrix = req.query.matrix;
    let level = req.query.level;
    if (req.query.refaddress !== '0' || req.query.refid !== '0'){
        if (req.query.refaddress){
            await user.findOne({ address: req.params.useraddress }).populate({
                path: "partners", model: user, match: { address: { $eq: req.query.refaddress } }, 
            }).exec(async (e, foundx6) => {
                sendresponse(foundx6)
            })
        }else{
            await user.findOne({ address: req.params.useraddress }).populate({
                path: "partners", model: user, match: { id: { $eq: Number(req.query.refid) } }
            }).exec(async (e, foundx6) => {
                sendresponse(foundx6)
            })
        }
        
    }
    if (req.params.useraddress && matrix === '0' && level === '0' && req.query.refaddress === '0' && req.query.refid ==='0'){
        console.log(typeof (req.query.refid))
    await user.findOne({ address: req.params.useraddress }).populate({
            path: "partners", model: user, options: {
                sort: {},
                skip: Number(req.query.skip),
                limit: 5
            }
        }).exec(async (e, foundx6) => {
            sendresponse(foundx6)
        })
    } else if (req.params.useraddress && (matrix !== '0' || level !== '0') && req.query.refaddress === '0' && req.query.refid === '0'){
        console.log(typeof(req.query.refid))
        if(req.query.matrix === 'egr'){
            await user.findOne({ address: req.params.useraddress }).populate({
                path: "partners", model: user, match: { x3count: { $gte: Number(req.query.level) } }, options: {
                    sort: {},
                    skip: Number(req.query.skip),
                    limit: 5
                }
            }).exec(async (e, foundx6) => {
                sendresponse(foundx6)
            })
        } else if (req.query.matrix === 'lzy'){
            await user.findOne({ address: req.params.useraddress }).populate({
                path: "partners", model: user, match: { x6count: { $gte: Number(req.query.level) } }, options: {
                    sort: {},
                    skip: Number(req.query.skip),
                    limit: 5
                }
            }).exec(async (e, foundx6) => {
                sendresponse(foundx6)
            })
        }
        
    }

    let sendresponse = (data) => {
        if (data) {
            res.json(data)
        } else {
            res.json({ response: 'Not Found' })
        }

    }
    

})




module.exports = router