import React, { useEffect, useState } from "react";
import styles from "../styles/Withdraw.module.scss";
import { AiOutlineRollback } from "react-icons/ai";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Withdraw = () => {
  const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");
  const [userData, setUserData] = useState({});
  const [userBalance, setUserBalance] = useState(0);
  const [withdrawAmount, setWithDrawAmount] = useState(0);
  const [remainingAmt, setRemainingAmt] = useState(0);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [desc, setDesc] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUserName(user.displayName);
        setUserID(uid);
        setDesc("Withdrawing Amount");
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

      if (withdrawAmount <= amt) {
        const remainingBalance = amt - withdrawAmount;

        await updateDoc(docRef, {
          balance: remainingBalance,
        });

        

        try {
          const transactionRef = await addDoc(collection(db, "transactions"), {
            type: "withdraw",
            debit: withdrawAmount,
            desc: desc,
            credit: 0,
            balance: remainingBalance,
            username:userName
          });

          console.log("Document written with ID: ", transactionRef.id);
        } catch (e) {
          console.error("Error adding document: ", e);
        }

        setRemainingAmt(remainingBalance);
        setWithDrawAmount(0);
        setSuccess(true);

        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        setError(true);
      }
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
          <h1>Withdraw</h1>
          <p>Enter the Amount to withdraw the amount</p>
        </div>
        <div className={styles.actions}>
          <input
            type="number"
            placeholder="Enter Amount"
            value={withdrawAmount}
            onChange={(e) => setWithDrawAmount(e.target.value)}
          />
          <div className={styles.button}>
            <button onClick={handleWithdraw}>withdraw</button>
          </div>
        </div>
        {error && (
          <span className={styles.errorNote}>
            Balance is Low! Please Enter between 1 to {userBalance}
          </span>
        )}
        {success && (
          <>
            <span className={styles.successNote}>
              Withdrawal Completed Successfully! &nbsp;
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

export default Withdraw;
