const SHA256 = require('crypto-js/sha256')

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount
  }
}

class Block {
  constructor(timestamp, transactions, data, previousHash = '') {
    this.timestamp = timestamp;
    this.previousHash = previousHash;
    this.transactions = transactions;
    this.hash = this.calculateHash();
    this.nonce = 0
  }

  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timestamp +
      JSON.stringify(this.data) + this.nonce).toString();
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
    this.difficulty = 4;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block('01/01/2021', 'Genesis', '0')
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  minePendingTransaction(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);
    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ];
    console.log('Block mined');
    this.chain.push(block)
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if(trans.fromAddress === address) {
          balance -= trans.amount;
        }

        if(trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }
    return balance;
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

ourCrypto.createTransaction(new Transaction('address1', 'address2', 100));
ourCrypto.createTransaction(new Transaction('address2', 'address1', 50));

console.log('Start mining');
ourCrypto.minePendingTransaction('our-address');

console.log('Balance of account our address', ourCrypto.getBalanceOfAddress('our-address'));

console.log('start mining the second time');
ourCrypto.minePendingTransaction('our-address');
console.log('Balance of account our address', ourCrypto.getBalanceOfAddress('our-address'));

