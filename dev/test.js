const Blockchin = require('./blockchain');
const UCVcoin = new Blockchin();


const previousBlockHash = '0000000000000000';
const currentBlockData = [
    {
        amount: 10,
        sender: '0x412412salndosdqw',
        recipient: '0xwqw2iu4n2i'
    },
    {
        amount: 20,
        sender: '0x053850312412saln',
        recipient: '0xwqw2iu4n2i'
    },
    {
        amount: 810,
        sender: '0x423253t12salndosdqw',
        recipient: '0xwqw2iu4n2i'
    }
];
const nonce = 100;

console.log(UCVcoin.hashBlock(previousBlockHash, currentBlockData, nonce));