const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');
const fs = require('fs');
const userDataPath = `${__dirname}/user.json`;

let nodeAddress = '';
fs.access(userDataPath, fs.constants.F_OK, (error) => {
    if (error) {
        const generatedAddress = uuid().split('-').join('');
        const writeStream = fs.createWriteStream(userDataPath);
        writeStream.write(JSON.stringify({ nodeAddress: generatedAddress }));
        writeStream.close();
    } else {
        fs.readFile(userDataPath, (err, data) => {
            if (data) {
                this.nodeAddress = JSON.parse(data.toString()).nodeAddress;
            }
        })
    }
});


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

app.listen(3000, () => {
    console.log('Listening on port 3000...');
});