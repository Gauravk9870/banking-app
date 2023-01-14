import { async } from "@firebase/util";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Withdraw from "../components/Withdraw";
import { auth, db } from "../firebase";
import styles from "../styles/Home.module.scss";
import { FaUserCircle } from "react-icons/fa";
import { BiTransferAlt } from "react-icons/bi";
import { AiFillBank, AiOutlineHistory } from "react-icons/ai";
import { BsCashCoin } from "react-icons/bs";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [balance, setBalance] = useState(0); // Initialize balance
  const [userID, setUserID] = useState("");
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUsername(user.displayName);
        setEmail(user.email);
        setUserID(user.uid);
      }
    });
  }, []);

  const getBalance = async () => {
    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setBalance(docSnap.data().balance);
      setClicked(true);
    } else {
      setBalance("NaN");
    }
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Signing Out");
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={styles.home}>
      <div className={styles.container}>
        <div className={styles.title}>
          <FaUserCircle className={styles.avatar} />
          <h2>{username}</h2>
          <div className={styles.userEmail}>
            <span>Email Id : </span>
            <span>{email}</span>
          </div>

          <div className={styles.buttons}>
            <div className={styles.userBalance}>
              {clicked ? (
                <span className={styles.balance}>Total Amount : {balance}</span>
              ) : (
                <>
                  <button onClick={getBalance} className={styles.btn}>
                    Check Balance
                  </button>
                  <button className={styles.btn} onClick={handleSignOut}>
                    sign out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <Link to="/withdraw">
            <div className={styles.withdraw}>
              <BsCashCoin />
              <span>Withdraw</span>
            </div>
          </Link>

          <Link to="/deposit">
            <div className={styles.deposit}>
              <AiFillBank />
              <span>Deposit</span>
            </div>
          </Link>

          <Link to="/transfer">
            <div className={styles.transfer}>
              <BiTransferAlt />
              <span>Transfer</span>
            </div>
          </Link>

          <Link to="/transactions">
            <div className={styles.history}>
              <AiOutlineHistory />
              <span>History</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
