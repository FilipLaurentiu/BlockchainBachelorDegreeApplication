const Blockchin = require('./blockchain');
const UCVcoin = new Blockchin();


const bc1 = {
    "chain": [
        {
            "index": 1,
            "timestamp": 1565892857049,
            "transactions": [],
            "nonce": 0,
            "hash": "0",
            "previousBlockHash": "0"
        },
        {
            "index": 2,
            "timestamp": 1565892927997,
            "transactions": [
                {
                    "amount": 4545,
                    "sender": "fvdfgd",
                    "recipient": "dgfdher",
                    "transactionId": "8af26670bf8811e980a491aa074f4c46"
                },
                {
                    "amount": 34324,
                    "sender": "434",
                    "recipient": "dfgdfgd",
                    "transactionId": "9061b250bf8811e980a491aa074f4c46"
                },
                {
                    "amount": 4241,
                    "sender": "sdfs",
                    "recipient": "sdfs",
                    "transactionId": "986f01a0bf8811e980a491aa074f4c46"
                },
                {
                    "amount": 67,
                    "sender": "dgdfhdh",
                    "recipient": "gfdgwegw",
                    "transactionId": "9dcb61c0bf8811e980a491aa074f4c46"
                },
                {
                    "amount": 22,
                    "sender": "rwfdcx",
                    "recipient": "dfgdhj",
                    "transactionId": "a32c7cd0bf8811e980a491aa074f4c46"
                }
            ],
            "nonce": 6432,
            "hash": "000031a2d527c919fd2b1b256377694bb7af722ad49c3215878e71557f3a30e7",
            "previousBlockHash": "0"
        },
        {
            "index": 3,
            "timestamp": 1565892995327,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "0x000",
                    "recipient": "0xe210e12donq",
                    "transactionId": "a8ce4a60bf8811e980a491aa074f4c46"
                },
                {
                    "amount": 1,
                    "sender": "vbcv",
                    "recipient": "vbvbvbcn",
                    "transactionId": "c6c24a30bf8811e980a491aa074f4c46"
                },
                {
                    "amount": 575474,
                    "sender": "ghgfjf",
                    "recipient": "hfgjf",
                    "transactionId": "cc15a9a0bf8811e980a491aa074f4c46"
                }
            ],
            "nonce": 42777,
            "hash": "0000618832adf8bacaf100c1e39d12b0c3493421c387e569bb5208e4a30e68a4",
            "previousBlockHash": "000031a2d527c919fd2b1b256377694bb7af722ad49c3215878e71557f3a30e7"
        },
        {
            "index": 4,
            "timestamp": 1565893047451,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "0x000",
                    "recipient": "0xe210e12donq",
                    "transactionId": "d0eed000bf8811e980a491aa074f4c46"
                },
                {
                    "amount": 45,
                    "sender": "gfg",
                    "recipient": "gfg",
                    "transactionId": "e1783600bf8811e980a491aa074f4c46"
                },
                {
                    "amount": 7567,
                    "sender": "65efd",
                    "recipient": "wer352",
                    "transactionId": "e74cfa70bf8811e980a491aa074f4c46"
                }
            ],
            "nonce": 7171,
            "hash": "0000e47080af87215fabb046e826712ac4d3c436bf9be73f6229394ae63fd531",
            "previousBlockHash": "0000618832adf8bacaf100c1e39d12b0c3493421c387e569bb5208e4a30e68a4"
        },
        {
            "index": 5,
            "timestamp": 1565893053685,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "0x000",
                    "recipient": "0xe210e12donq",
                    "transactionId": "f0004dc0bf8811e980a491aa074f4c46"
                }
            ],
            "nonce": 37183,
            "hash": "00000d480628fc4367423e5b0db6df2273904412353e6ea8c9ce72736dad97d7",
            "previousBlockHash": "0000e47080af87215fabb046e826712ac4d3c436bf9be73f6229394ae63fd531"
        },
        {
            "index": 6,
            "timestamp": 1565893054687,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "0x000",
                    "recipient": "0xe210e12donq",
                    "transactionId": "f3b78960bf8811e980a491aa074f4c46"
                }
            ],
            "nonce": 52958,
            "hash": "00008e9c7e6a8fd56418d97f8315e56c83ec5346ce1c2c14f844131e9a909ab5",
            "previousBlockHash": "00000d480628fc4367423e5b0db6df2273904412353e6ea8c9ce72736dad97d7"
        }
    ],
    "pendingTransactions": [
        {
            "amount": 12.5,
            "sender": "0x000",
            "recipient": "0xe210e12donq",
            "transactionId": "f4506e00bf8811e980a491aa074f4c46"
        }
    ],
    "difficulty": "0000",
    "networkNodes": [],
    "currentNodeUrl": "http://localhost:3001"
};


console.log('VALID: ', UCVcoin.chainIsValid(bc1.chain));