import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineRollback } from "react-icons/ai";
import styles from "../styles/Transactions.module.scss";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const Transactions = () => {
  const [userName, setUserName] = useState("");
  const [userID, setUserID] = useState("");
  const [trans, setTrans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUserName(user.displayName);
        setUserID(uid);
      } else {
        console.log("Not Found");
      }
    });

    handleTransactions();
  }, [userName]);

  const handleTransactions = async () => {
    const docRef = collection(db, "transactions");
    const q = query(docRef, where("username", "==", userName));

    const querySnapshot = await getDocs(q);
    let newTransactions = [];
    querySnapshot.forEach((doc) => {
    //   console.log(doc.data().username, " : ", doc.data());
      newTransactions.push(doc.data());
    });
    setTrans(newTransactions);
  };




  return (
    <div className={styles.transactions}>
      <div className={styles.container}>
        <Link to="/">
          <div className={styles.back}>
            <button>
              <AiOutlineRollback />
            </button>
          </div>
        </Link>
        <div className={styles.title}>
          <h1>Transactions</h1>
          <p>All Transactions related to your Account</p>
        </div>
        <div className={styles.content}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Dr.</th>
                <th>Cr.</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
                
              {trans.map((t, i) => (
                <tr key={i}>
                  <td>{t.type}</td>
                  <td>{t.desc}</td>
                  <td>{t.debit}</td>
                  <td>{t.credit}</td>
                  <td>{t.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
