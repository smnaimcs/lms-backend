class BankService {
  constructor() {
    this.transactions = new Map();
  }

  // Simulate bank transaction from user to LMS
  async processTransaction(fromAccount, toAccount, amount, secretKey) {
    // Validate accounts and secret key
    if (fromAccount.secretKey !== secretKey) {
      throw new Error('Invalid secret key');
    }

    if (fromAccount.balance < amount) {
      throw new Error('Insufficient funds');
    }

    // Process transaction
    fromAccount.balance -= amount;
    toAccount.balance += amount;

    const transactionId = `TXN${Date.now()}`;
    this.transactions.set(transactionId, {
      id: transactionId,
      from: fromAccount.accountNumber,
      to: toAccount.accountNumber,
      amount,
      timestamp: new Date(),
      status: 'completed'
    });

    return {
      success: true,
      transactionId,
      newBalance: fromAccount.balance,
      timestamp: new Date()
    };
  }

  // Simulate payout from LMS to user
  async processPayout(fromAccount, toAccount, amount) {
    if (fromAccount.balance < amount) {
      throw new Error('LMS organization has insufficient funds');
    }

    // Process payout
    fromAccount.balance -= amount;
    toAccount.balance += amount;

    const transactionId = `PAY${Date.now()}`;
    this.transactions.set(transactionId, {
      id: transactionId,
      from: fromAccount.accountNumber,
      to: toAccount.accountNumber,
      amount,
      timestamp: new Date(),
      status: 'completed'
    });

    return {
      success: true,
      transactionId,
      timestamp: new Date()
    };
  }

  // Validate transaction with bank
  async validateTransaction(transactionId) {
    const transaction = this.transactions.get(transactionId);
    
    if (!transaction) {
      return { valid: false, message: 'Transaction not found' };
    }

    return {
      valid: true,
      transaction,
      message: 'Transaction validated successfully'
    };
  }

  validateAccount(account, secretKey) {
    return account.secretKey === secretKey;
  }

  async getBalance(account) {
    return {
      accountNumber: account.accountNumber,
      balance: account.balance,
      lastUpdated: new Date()
    };
  }

  // Get LMS organization balance
  async getLMSBalance(lmsAccount) {
    return {
      organization: 'LMS System',
      accountNumber: lmsAccount.accountNumber,
      balance: lmsAccount.balance,
      totalRevenue: lmsAccount.totalRevenue,
      totalPayouts: lmsAccount.totalPayouts,
      netBalance: lmsAccount.totalRevenue - lmsAccount.totalPayouts,
      lastUpdated: new Date()
    };
  }
}

module.exports = new BankService();