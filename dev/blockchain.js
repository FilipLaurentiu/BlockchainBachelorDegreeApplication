const sha256 = require('sha256');
const uuid = require('uuid/v1');

class Blockchain {
    constructor(difficulty = '0000') {
        this.chain = [];
        this.pendingTransactions = [];
        this.difficulty = difficulty;
        this.networkNodes = [];
        this.createNewBlock(0, '0', '0');
        this.currentNodeUrl = `http://localhost:${process.argv[2]}`;
    }

    createNewBlock(nonce, previousBlockHash, hash) {
        const newBlock = {
            index: this.chain.length + 1,
            timestamp: Date.now(),
            transactions: this.pendingTransactions,
            nonce: nonce,
            hash: hash,
            previousBlockHash: previousBlockHash
        };

        this.pendingTransactions = [];
        this.chain.push(newBlock);

        return newBlock;
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    createNewTransaction(amount, sender, recipient) {
        const newTransaction = {
            amount,
            sender,
            recipient,
            transactionId: uuid().split('-').join('')
        };
        return newTransaction;
    }

    addTransactionToPendingTransactions(transactionObj) {
        this.pendingTransactions.push(transactionObj);
        return this.getLastBlock().index + 1;
    }

    hashBlock(previousBlockHash, currentBlockData, nonce) {
        const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
        const hash = sha256(dataAsString);
        return hash;
    }

    proofOfWork(previousBlockHash, currentBlockData) {
        let nonce = 0;
        let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        while (hash.substring(0, this.difficulty.length) !== this.difficulty) {
            nonce++;
            hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        }
        return nonce;
    }

    chainIsValid(blockchain) {
        for (let i = 1; i < blockchain.length; i++) {
            const currentBlock = blockchain[i];
            const previousBlock = blockchain[i - 1];
            const blockHash = this.hashBlock(previousBlock.hash, { transactions: currentBlock.transactions, index: currentBlock.index }, currentBlock.nonce);
            if (currentBlock.previousBlockHash !== previousBlock.hash || blockHash.substring(0, this.difficulty.length) !== this.difficulty) {
                return false;
            }
        }

        return blockchain[0].nonce === 0 && blockchain[0].previousBlockHash === '0' && blockchain[0].hash === '0';
    }

    getBlock(blockHash) {
        return this.chain.find(block => block.hash === blockHash);
    }
}

module.exports = Blockchain;
