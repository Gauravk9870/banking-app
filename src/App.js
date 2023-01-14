import Login from "./pages/Login";
import "../src/App.scss";
import Register from "./pages/Register";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Withdraw from "./components/Withdraw";
import Deposit from "./components/Deposit";
import Transfer from "./components/Transfer";
import Transactions from "./components/Transactions";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useState } from "react";


function App() {
  const [user, setUser] = useState("");

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      setUser(uid);
    }
  })

  const ProtectedRoutes = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" />
    }

    return children;
  }
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* <Route path="/" element={<ProtectedRoutes><Home /></ProtectedRoutes>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/withdraw" element={<ProtectedRoutes><Withdraw /></ProtectedRoutes>} />
          <Route path="/deposit" element={<ProtectedRoutes><Deposit /></ProtectedRoutes>} />
          <Route path="/transfer" element={<ProtectedRoutes><Transfer /></ProtectedRoutes>} />
          <Route path="/transactions" element={<ProtectedRoutes><Transactions /></ProtectedRoutes>} /> */}

          <Route path="/" element={<Home/>}/>
          <Route path="/withdraw" element={<Withdraw/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/transfer" element={<Transfer/>}/>
          <Route path="/deposit" element={<Deposit/>}/>
          <Route path="/transactions" element={<Transactions/>}/>

        </Routes>
      </Router>
    </div>
  );
}

export default App;
