import React, { useEffect, useState } from "react";
import styles from "../styles/Withdraw.module.scss";
import { AiOutlineRollback } from "react-icons/ai";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Deposit = () => {
  const [userID, setUserID] = useState("");
  const [userData, setUserData] = useState({});
  const [userBalance, setUserBalance] = useState(0);
  const [depositAmount, setDeposit] = useState(0);
  const [remainingAmt, setRemainingAmt] = useState(0);
  const [success, setSuccess] = useState(false);
  const [userName, setUserName] = useState("");
  const [desc, setDesc] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUserName(user.displayName);
        setUserID(uid);
        setDesc("Depositing Amount");

      } else {
        console.log("Not Found");
      }
    });
  }, []);

  const handleWithdraw = async () => {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("User Data : ", docSnap.data());
      setUserData(docSnap.data());
      const amt = docSnap.data().balance;
      console.log("Amt : ", amt);
      setUserBalance(amt);

      const remainingBalance = Number(amt) + Number(depositAmount);

      await updateDoc(docRef, {
        balance: remainingBalance,
      });

      try {
        const transactionRef = await addDoc(collection(db, "transactions"), {
          type: "deposit",
          debit: 0,
          credit: depositAmount,
          balance: remainingBalance,
          username : userName,
          desc : desc
        });

        console.log("Document written with ID: ", transactionRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }

      setRemainingAmt(remainingBalance);
      setDeposit(0);
      setSuccess(true);

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } else {
      console.log("Not Such Document Found!");
    }
  };

  return (
    <div className={styles.withdraw}>
      <div className={styles.container}>
        <Link to="/">
          <div className={styles.back}>
            <button>
              <AiOutlineRollback />
            </button>
          </div>
        </Link>
        <div className={styles.title}>
          <h1>Deposit</h1>
          <p>Enter the Amount to be Deposited </p>
        </div>
        <div className={styles.actions}>
          <input
            type="number"
            placeholder="Enter Amount"
            value={depositAmount}
            onChange={(e) => setDeposit(e.target.value)}
          />
          <div className={styles.button}>
            <button onClick={handleWithdraw}>deposit</button>
          </div>
        </div>
        {success && (
          <>
            <span className={styles.successNote}>
              Deposit Completed Successfully! &nbsp;
              <span className={styles.remainingAmt}>
                Remaining Amount : {remainingAmt}
              </span>
              <br />
              Returning Home
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default Deposit;
