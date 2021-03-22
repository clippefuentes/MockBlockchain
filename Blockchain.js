const SHA256 = require('crypto-js/sha256')

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.previousHash = previousHash;

    this.hash = this.calculateHash();
    this.nonce = 0
  }

  calculateHash() {
    return SHA256(this.index+ this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  mineBlock(difficulty) {
    while(this.hash.substring(0, difficulty) !== Array(difficulty+1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash()
    }
    console.log('Block Mine:', this.hash)
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 6
  }

  createGenesisBlock() {
    return new Block(0, '01/01/2021', 'Genesis', '0')
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isValidChain () {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if(currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if(currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true
  }
}

let ourCrypto = new Blockchain()

// console.log('Mine Block 1')
// ourCrypto.addBlock(new Block(1, '01/02/2021', { amount: 1 }))
// ourCrypto.addBlock(new Block(2, '01/03/2021', { amount: 2 }))

// console.log(JSON.stringify(ourCrypto, null, 4))

// console.log('Chain is valid?', ourCrypto.isValidChain())
// ourCrypto.chain[1].data = { amount: 100 }
// ourCrypto.chain[1].hash = ourCrypto.chain[1].calculateHash()
// console.log(JSON.stringify(ourCrypto, null, 4))

// console.log('Chain is valid?', ourCrypto.isValidChain())
console.log('Mine Block 1')
ourCrypto.addBlock(new Block(1, '01/02/2021', { amount: 12 }))
console.log('Mine Block 2')
ourCrypto.addBlock(new Block(1, '01/03/2021', { amount: 15 }))