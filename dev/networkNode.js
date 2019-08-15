const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');
const rp = require('request-promise');
const nodeAddress = process.argv[3] ? process.argv[3] : uuid().split('-').join('');
console.log(nodeAddress);
const port = process.argv[2];


const UCVcoin = new Blockchain();
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/blockchain', (req, res) => {
    res.send(UCVcoin);
});

app.post('/transaction', (req, res) => {
    const body = req.body;
    const blockIndex = UCVcoin.createNewTransaction(body.amount, body.sender, body.recipient)
    res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});

app.get('/mine', (req, res) => {
    const lastBlock = UCVcoin.getLastBlock();
    const previousBlockHash = lastBlock.hash;
    const currectBlockData = {
        transations: UCVcoin.pendingTransactions,
        index: lastBlock.index + 1
    }
    const nonce = UCVcoin.proofOfWork(previousBlockHash, currectBlockData);
    const blockHash = UCVcoin.hashBlock(previousBlockHash, currectBlockData, nonce);
    UCVcoin.createNewTransaction(12.5, '0x0', nodeAddress); // reward the miner
    const newBlock = UCVcoin.createNewBlock(nonce, previousBlockHash, blockHash);
    res.json({
        note: "New block mined successfully",
        block: newBlock,
    });
});

// register a node and broadcast a node to the network
app.post('/register-and-broadcast-node', (req, res) => {
    const newNodeUrl = req.body.newNodeUrl;
    if (!UCVcoin.networkNodes.includes(newNodeUrl)) {
        UCVcoin.networkNodes.push(newNodeUrl);
    }
    const regNodesPromises = [];
    UCVcoin.networkNodes.forEach(node => {
        const requestOptions = {
            uri: node + '/register-node',
            method: 'POST',
            body: { newNodeUrl: newNodeUrl },
            json: true
        }
        regNodesPromises.push(rp(requestOptions));
    });
    Promise.all(regNodesPromises).then(data => {
        const bulkRegisterOptions = {
            uri: newNodeUrl + '/register-nodes-bulk',
            method: 'POST',
            body: { allNetworkNodes: [...UCVcoin.networkNodes, UCVcoin.currentNodeUrl] },
            json: true
        }
        return rp(bulkRegisterOptions);
    }).then(data => {
        res.json({ note: "New node registered succesfully" });
    });
});

app.post('/register-node', (req, res) => {
    const newNodeUrl = req.body.newNodeUrl;
    if (!UCVcoin.networkNodes.includes(newNodeUrl) && newNodeUrl !== UCVcoin.currentNodeUrl) {
        UCVcoin.networkNodes.push(newNodeUrl);
        res.json({ note: "New node register succsessfully." })
    } else {
        res.json({ note: "Note already exist" });
    }
});

//register multiple nodes at once
app.post('/register-nodes-bulk', (req, res) => {
    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach(networkNodeUrl => {
        if (!UCVcoin.networkNodes.includes(networkNodeUrl) && networkNodeUrl !== UCVcoin.currentNodeUrl) {
            UCVcoin.networkNodes.push(networkNodeUrl);
        }
    });
    res.json({ note: 'Bulk registration successful.' });
})


app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});