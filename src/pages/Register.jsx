import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Register.module.scss";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const navigate = useNavigate();
  const [firstName, SetFirstName] = useState("");
  const [lastName, SetLastName] = useState("");
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");

  const [error, SetError] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    const name = firstName + " " + lastName;

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (res) => {
        const user = res.user;

        await updateProfile(user, { displayName: name });

        await setDoc(doc(db, "users", res.user.uid), {
          uid: res.user.uid,
          displayName: name,
          email: email,
          balance: 1000,
        });

        SetFirstName("");
        SetLastName("");
        SetEmail("");
        SetPassword("");
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        SetError(true);
      });
  };

  return (
    <div className={styles.register}>
      <div className={styles.container}>
        <div className={styles.title}>
          <h2>
            Welcome to <span>Spark Foundation</span>
          </h2>
          <h1>Banking App</h1>
          <p>Register</p>
        </div>

        <form onSubmit={handleSignUp} className={styles.form}>
          <div className={styles.name}>
            <div className={styles.firstName}>
              <label htmlFor="">First Name</label>
              <input
                type="text"
                placeholder="Gaurav"
                name="firstname"
                onChange={(e) => SetFirstName(e.target.value)}
                required
              />
            </div>

            <div className={styles.lastName}>
              <label htmlFor="">Last Name</label>
              <input
                type="text"
                placeholder="Kumar"
                name="lastname"
                onChange={(e) => SetLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.email}>
            <label htmlFor="">Email</label>
            <input
              type="mail"
              placeholder="gauravk@gmail.com"
              name="email"
              onChange={(e) => SetEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.password}>
            <label htmlFor="">Password</label>
            <input
              type="text"
              placeholder="Password"
              name="password"
              onChange={(e) => SetPassword(e.target.value)}
              required
            />
          </div>

          <p className={error ? styles.errorNote : styles.note}>
            {error
              ? "Error : Please Refresh Page and Try Again"
              : "Register yourself to use Banking services"}
          </p>
          <div className={styles.button}>
            <button>Register</button>
          </div>
          <p className={styles.notAUser}>
            Already have an account ? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
