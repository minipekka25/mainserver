const Web3 = require('web3');
// const Hyper = require('../../client/src/contracts/Hyper.json');

const Hyper = require('./abi').hyper

const wss_url = "http://127.0.0.1:7545"

let provider = new Web3.providers.WebsocketProvider(wss_url);

const web3 = new Web3(provider)



module.exports = web3;

