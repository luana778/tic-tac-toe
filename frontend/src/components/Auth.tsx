import React, { useState } from "react";
import type { User } from "../types";
import { signIn, signUp } from "../services/authApi";
import "./Auth.css";

interface Props {
  onLogin: (user: User) => void;
}

const Auth: React.FC<Props> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!username || !password) {
      setError("All fields required");
      return;
    }

    try {
      const { data } = isSignup
        ? await signUp(username, password)
        : await signIn(username, password);

      if (data.success) {
        onLogin({ id: data.id, username: data.username });
      } else {
        setError(data.message);
      }
    } catch {
      setError("Server error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isSignup ? "Sign Up" : "Sign In"}</h2>

        {error && <p className="auth-error">{error}</p>}

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        <button onClick={handleSubmit}>
          {isSignup ? "Sign Up" : "Sign In"}
        </button>

        <button onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? "Switch to Sign In" : "Switch to Sign Up"}
        </button>
      </div>
    </div>
  );
};

export default Auth;