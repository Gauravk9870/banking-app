import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Transfer.module.scss";
import { AiOutlineRollback } from "react-icons/ai";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

const Transfer = () => {
  const [userId, setUserId] = useState("");
  const [senderBalance, setSenderBalance] = useState(0);
  const [transferAmount, setTransferAmount] = useState(0);
  const [senderRemainingAmt, setSenderRemainingAmt] = useState(0);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [senderName, setSenderName] = useState("");

  const [recipientMail, setRecipientMail] = useState("");
  const [recipientID, setRecipientID] = useState("");
  const [recipientBalance, setRecipientBalance] = useState(0);
  const [recipientRemainingAmt, setRecipientRemainingAmt] = useState(0);
  const [recipientName, setRecipientName] = useState("");
  const [desc, setDesc] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        const username = user.displayName;
        setSenderName(username);
        setUserId(uid);
      } else {
        setError("Error : Something went wrong");
      }
    });

    const getRecipient = async () => {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", recipientMail));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        setRecipientName(doc.data().displayName);
        setDesc("Transfered To " + doc.data().displayName);
        setRecipientID(doc.data().uid);
      });
    };

    getRecipient();
  }, [recipientMail]);

  const handleTransfer = async () => {
    // Finding The Recipient
    console.log("Calling HandleTransfer");
    if (recipientID) {
      console.log("Entered In HandleTransfer");
      // Sender Details
      const senderRef = doc(db, "users", userId);
      const senderSnap = await getDoc(senderRef);

      // Recepitent Data
      const recipientRef = doc(db, "users", recipientID);
      const recipientSnap = await getDoc(recipientRef);

      // Decducting Amount From Sender
      if (senderSnap.exists()) {
        const amt = senderSnap.data().balance;
        setSenderBalance(amt);

        if (transferAmount <= amt) {
          const remainingSenderBalance = Number(amt) - Number(transferAmount);

          await updateDoc(senderRef, {
            balance: remainingSenderBalance,
          });

          setSuccessMsg("Transferring....");

          setSenderRemainingAmt(remainingSenderBalance);

          if (recipientSnap.exists()) {
            const amt = recipientSnap.data().balance;
            setRecipientBalance(amt);

            const updatedRecipientBalance =
              Number(amt) + Number(transferAmount);

            await updateDoc(recipientRef, {
              balance: updatedRecipientBalance,
            });

            setSuccessMsg("Transaction completed successfully");

            setRecipientRemainingAmt(updatedRecipientBalance);

            // Maintaing Passbook
            try {
              const transactionRef = await addDoc(
                collection(db, "transactions"),
                {
                  type: "transfer",
                  debit: transferAmount,
                  credit: 0,
                  username: senderName,
                  to: recipientName,
                  desc: desc,
                  balance: remainingSenderBalance,
                  senderId: userId,
                  recipientId: recipientID,
                }
              );

              console.log("Document written with ID: ", transactionRef.id);
            } catch (e) {
              console.error("Error adding document: ", e);
            }

            setTransferAmount(0);
            setRecipientMail("");
            setSuccess(true);
            setTimeout(() => {
              navigate("/");
            }, 3000);
          } else {
            setErrorMsg("Error : User Not Found");
          }
        } else {
          setErrorMsg("Error : Insufficient Amount!");
        }
      }
    } else {
      setErrorMsg("Username Not Found! Please Enter Valid Username");
    }
  };

  return (
    <div className={styles.transfer}>
      <div className={styles.container}>
        <Link to="/">
          <div className={styles.back}>
            <button>
              <AiOutlineRollback />
            </button>
          </div>
        </Link>
        <div className={styles.title}>
          <h1>Transfer</h1>
          <p>Enter Details of recipient and Amount to be Transfered</p>
        </div>

        <div className={styles.actions}>
          <div className={styles.recipient}>
            <input
              type="mail"
              placeholder="Enter Recipient Email"
              value={recipientMail}
              onChange={(e) => setRecipientMail(e.target.value)}
              required
            />
          </div>
          <div className={styles.input}>
            <input
              type="number"
              placeholder="Enter Amount"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              required
            />
            <div className={styles.button}>
              <button onClick={handleTransfer}>transfer</button>
            </div>
          </div>
        </div>

        {successMsg && (
          <div className={styles.successNote}>
            {successMsg} <br /> Returing Home
          </div>
        )}

        {errorMsg && <div className={styles.errorNote}>{errorMsg}</div>}
      </div>
    </div>
  );
};

export default Transfer;
