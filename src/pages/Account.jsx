import React, { useState,useEffect } from "react";
import { auth, db } from "../firebase";

const Account = () => {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      const user = auth.currentUser;
      if (!user) return;

      // Fetch transaction history
      const snapshot = await db
        .collection("users")
        .doc(user.uid)
        .collection("transactions")
        .get();

      setTransactions(snapshot.docs.map((doc) => doc.data()));
    };

    fetchTransactions();
  }, []);

  const handleWithdraw = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not signed in");

      // Get current balance
      const snapshot = await db.collection("users").doc(user.uid).get();
      const balance = snapshot.data().balance;
      if (amount > balance) throw new Error("Insufficient funds");

      // Update balance and add transaction to history
      await db
        .collection("users")
        .doc(user.uid)
        .update({
          balance: balance - amount,
        });
      await db
        .collection("users")
        .doc(user.uid)
        .collection("transactions")
        .add({
          type: "withdraw",
          amount,
          timestamp: Date.now(),
        });
      setMessage("Withdraw successful");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleDeposit = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not signed in");

      // Get current balance
      const snapshot = await db.collection("users").doc(user.uid).get();
      const balance = snapshot.data().balance;

      // Update balance and add transaction to history
      await db
        .collection("users")
        .doc(user.uid)
        .update({
          balance: balance + amount,
        });
      await db
        .collection("users")
        .doc(user.uid)
        .collection("transactions")
        .add({
          type: "deposit",
          amount,
          timestamp: Date.now(),
        });
      setMessage("Deposit successful");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleTransfer = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not signed in");

      // Get current balance
      const snapshot = await db.collection("users").doc(user.uid).get();
      const balance = snapshot.data().balance;
      if (amount > balance) throw new Error("Insufficient funds");
      // Check if recipient exists
      const recipientSnapshot = await db
        .collection("users")
        .doc(recipient)
        .get();
      if (!recipientSnapshot.exists) throw new Error("Recipient not found");

      // Update balance and add transaction to history
      await db
        .collection("users")
        .doc(user.uid)
        .update({
          balance: balance - amount,
        });
      await db
        .collection("users")
        .doc(recipient)
        .update({
          balance: recipientSnapshot.data().balance + amount,
        });
      await db
        .collection("users")
        .doc(user.uid)
        .collection("transactions")
        .add({
          type: "transfer",
          amount,
          recipient,
          timestamp: Date.now(),
        });
      setMessage("Transfer successful");
    } catch (error) {
      setMessage(error.message);
    }
  };
  const handleFetchTransactions = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not signed in");
      // Get transaction history
      const snapshot = await db
        .collection("users")
        .doc(user.uid)
        .collection("transactions")
        .get();
      const transactions = snapshot.docs.map((doc) => doc.data());
      setTransactions(transactions);
    } catch (error) {
      setMessage(error.message);
    }
  };
  return (
    <div>
      <h1>Account</h1>
      <form>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <br />
        <button type="button" onClick={handleWithdraw}>
          Withdraw
        </button>
        <button type="button" onClick={handleDeposit}>
          Deposit
        </button>
        <br />
        <label>
          Recipient:
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </label>
        <button type="button" onClick={handleTransfer}>
          Transfer
        </button>
      </form>
      <button type="button" onClick={handleFetchTransactions}>
        Fetch transactions
      </button>
      {transactions.map((transaction) => (
        <div key={transaction.timestamp}>
          <p>Type: {transaction.type}</p>
          <p>Amount: {transaction.amount}</p>
          <p>Timestamp: {transaction.timestamp}</p>
        </div>
      ))}
      <p>{message}</p>
    </div>
  );
};

export default Account;
