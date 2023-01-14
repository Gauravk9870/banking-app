import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Login.module.scss";

const Login = () => {
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  const [error, SetError] = useState(false);
  const [errorMsg, SetErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(async (res) => {
        setSuccessMsg("Logging...");
        SetEmail("");
        SetPassword("");
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        SetErrorMsg(err.message);
        SetError(true);
      });
  };

  return (
    <div className={styles.login}>
      <div className={styles.container}>
        <div className={styles.title}>
          <h2>
            Welcome to <span>Spark Foundation</span>
          </h2>
          <h1>Banking App</h1>
          <p>Login</p>
        </div>
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.email}>
            <label htmlFor="">Email</label>
            <input
              type="text"
              placeholder="gauravk@gmail.com"
              onChange={(e) => SetEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.password}>
            <label htmlFor="">Password</label>
            <input
              type="text"
              placeholder="Password"
              onChange={(e) => SetPassword(e.target.value)}
              required
            />
          </div>
          <p className={error ? styles.errorNote : styles.note}>
            {error ? errorMsg : "login to use Banking services"}
          </p>
          <div className={styles.button}>
            <button>Login</button>
          </div>
          <p className={styles.notAUser}>
            Don't have an account ? <Link to="/register">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
