

const express = require('express')
const app = express()
const port = 3005

let dashboard = require('./routes/dashboard')
let auth = require('./routes/auth')
let slots = require('./routes/slots')
let data = require('./routes/data')
let txn = require('./routes/transactions')
let partners = require('./routes/partners')
let stats = require('./routes/stats')
let invoice = require('./routes/invoice')



app.use(function (req, res, next) {

    // Website you wish to allow to connect

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use('/dashboard',dashboard)
app.use('/auth', auth)
app.use('/slots', slots)
app.use('/data', data)
app.use('/txn', txn)
app.use('/partners', partners)
app.use('/stats', stats)
app.use('/invoice',invoice)


app.listen(process.env.PORT || 3007, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
