const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');
const rp = require('request-promise');
const port = process.argv[2];


let nodeAddress = '';
if (process.argv[3]) {
    nodeAddress = process.argv[3];
} else {
    nodeAddress = uuid().split('-').join('');
    console.log(nodeAddress);
}

const UCVcoin = new Blockchain();
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/blockchain', (req, res) => {
    res.send(UCVcoin);
});

app.post('/transaction', (req, res) => {
    const newTransaction = req.body;
    const blockIndex = UCVcoin.addTransactionToPendingTransactions(newTransaction);
    res.json({ note: `Transaction will be added in block ${blockIndex}` });
});

app.post('/transaction/broadcast', (req, res) => {
    const body = req.body;
    const newTransaction = UCVcoin.createNewTransaction(body.amount, body.sender, body.recipient);
    UCVcoin.addTransactionToPendingTransactions(newTransaction);

    const requestPromises = [];
    UCVcoin.networkNodes.forEach(node => {
        const requestOptions = {
            uri: node + '/transaction',
            method: 'POST',
            body: newTransaction,
            json: true
        }

        requestPromises.push(rp(requestOptions));
    });
    Promise.all(requestPromises).then(data => {
        res.json({ note: 'Transaction created and broadcast successfully.' })
    });
});

app.get('/mine', (req, res) => {
    const lastBlock = UCVcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transactions: UCVcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    };
    const nonce = UCVcoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = UCVcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
    const newBlock = UCVcoin.createNewBlock(nonce, previousBlockHash, blockHash);

    const requestPromises = [];
    UCVcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/receive-new-block',
            method: 'POST',
            body: { newBlock },
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
        .then(data => {
            const requestOptions = {
                uri: UCVcoin.currentNodeUrl + '/transaction/broadcast',
                method: 'POST',
                body: {
                    amount: 12.5,
                    sender: "0x000",
                    recipient: nodeAddress
                },
                json: true
            };

            return rp(requestOptions);
        })
        .then(data => {
            res.json({
                note: "New block mined & broadcast successfully",
                block: newBlock
            });
        });
});


app.post('/receive-new-block', (req, res) => {
    const newBlock = req.body.newBlock;
    const lastBlock = UCVcoin.getLastBlock();
    const correctHash = (lastBlock.hash === newBlock.previousBlockHash);
    const correctIndex = (lastBlock.index + 1 === newBlock.index);
    if (correctHash && correctIndex) {
        UCVcoin.chain.push(newBlock);
        UCVcoin.pendingTransactions = [];
        res.json({
            note: 'New block recive and accepted.',
            newBlock
        });
    } else {
        res.json({
            note: 'New block rejected.',
            newBlock
        });
    }
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
});


app.get('/consensus', function (req, res) {
    const requestPromises = [];
    UCVcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/blockchain',
            method: 'GET',
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
        .then(blockchains => {
            const currentChainLength = UCVcoin.chain.length;
            let maxChainLength = currentChainLength;
            let newLongestChain = null;
            let newPendingTransactions = null;

            blockchains.forEach(blockchain => {
                if (blockchain.chain.length > maxChainLength) {
                    maxChainLength = blockchain.chain.length;
                    newLongestChain = blockchain.chain;
                    newPendingTransactions = blockchain.pendingTransactions;
                };
            });


            if (!newLongestChain || (newLongestChain && !UCVcoin.chainIsValid(newLongestChain))) {
                res.json({
                    note: 'Current chain has not been replaced.',
                    chain: UCVcoin.chain
                });
            }
            else {
                UCVcoin.chain = newLongestChain;
                UCVcoin.pendingTransactions = newPendingTransactions;
                res.json({
                    note: 'This chain has been replaced.',
                    chain: UCVcoin.chain
                });
            }
        });
});


app.get('/block/:blockHash', (req, res) => {
    const blockHash = req.params.blockHash;
    const correctBlock = UCVcoin.getBlock(blockHash);
    res.json({
        block: correctBlock
    })
});

app.get('/transaction/:transactionId', (req, res) => {
    const transactionId = req.params.transactionId;
    const correctTransaction = UCVcoin.getTransaction(transactionId);
    res.json({
        transaction: correctTransaction.transaction,
        block: correctTransaction.block
    })
});

app.get('/address/:address', (req, res) => {
    const address = req.params.address;
    const addressData = UCVcoin.getAddressData(address);
    res.json(addressData)
});


app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});