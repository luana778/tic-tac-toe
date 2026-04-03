import React, { useState } from "react";
import axios from "axios";
import type { User } from "../types";
import "./Auth.css";


interface Props {
  onLogin: (user: User) => void;
}

const Auth: React.FC<Props> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async () => {
    try {
      const url = isSignup ? "http://192.168.137.28:5137/signup" : "http://192.168.137.28:5137/signin";
      const res = await axios.post(url, { username, password });
      if (res.data.success) onLogin({ id: res.data.id, username: res.data.username });
      else alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">{isSignup ? "Sign Up" : "Sign In"}</h2>
        <input className="auth-input" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input className="auth-input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="auth-button" onClick={handleSubmit}>{isSignup ? "Sign Up" : "Sign In"}</button>
        <div className="auth-toggle">
          <button className="toggle-button" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "Have an account? Sign In" : "No account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;