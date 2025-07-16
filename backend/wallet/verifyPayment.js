import algosdk from 'algosdk';

// Connect to the Algorand TestNet Indexer
const indexer = new algosdk.Indexer(
  '', 
  'https://testnet-idx.algonode.cloud', 
  ''
);

export async function verifyPayment(from, to, minAlgo = 0.005) {
  try {
    console.log(`Checking transactions from ${from} to ${to}`);

    const response = await indexer.searchForTransactions()
      .address(from)
      .addressRole('sender')
      .txType('pay')
      .currencyGreaterThan(minAlgo * 1e6 - 1) // microAlgos
      .do();

    console.log(`Found ${response.transactions.length} transactions`);

    // DEBUG ALL TXNS
    for (const txn of response.transactions) {
      console.log("FULL TXN DEBUG:");
      console.log("FULL TXN DEBUG:");
      console.log(JSON.stringify(txn, (key, value) =>typeof value === 'bigint' ? value.toString() : value,2)
);

    }

    // Sort by round-time descending (latest first)
    const sortedTxns = response.transactions
      .filter(txn => {
        const receiver = txn['payment-transaction']?.receiver;
        const amount = txn['payment-transaction']?.amount;
        return receiver === to && amount >= minAlgo * 1e6;
      })
      .sort((a, b) => b['round-time'] - a['round-time']); // ✅ latest first

    const latest = sortedTxns[0]; // ✅ the latest matching txn

    return {
      match: !!latest,
      roundTime: latest?.['round-time'],
    };
  } catch (err) {
    console.error('Indexer error:', err.message);
    throw err;
  }
}
