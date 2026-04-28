import { useState, useEffect } from "react";
import "./App.css";
import ToastContainer from "./Toast";

function Login({ setIsLoggedIn }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [users, setUsers] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "",
    confirmPassword: "",
    name: ""
  });

  const addToast = (message, type) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    let storedUsers = JSON.parse(localStorage.getItem("users") || "[]");

    if (storedUsers.length > 0 && typeof storedUsers[0] === "string") {
      storedUsers = [];
      localStorage.setItem("users", JSON.stringify([]));
    }

    setUsers(storedUsers);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    if (!formData.email || !formData.password) {
      addToast("Please enter email and password", "error");
      return;
    }

    if (users.length === 0) {
      addToast("No users registered. Please register first.", "error");
      setIsRegistering(true);
      return;
    }

    const user = users.find(
      (u) =>
        u.email === formData.email && u.password === formData.password
    );

    if (user) {
      addToast("Login successful!", "success");
      localStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);
    } else {
      addToast("Invalid credentials. Please register first.", "error");
      setIsRegistering(true);
    }
  };

  const handleRegister = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      addToast("Please fill in all fields", "error");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      addToast("Passwords do not match", "error");
      return;
    }

    if (users.find((u) => u.email === formData.email)) {
      addToast("Email already registered. Please login.", "error");
      setIsRegistering(false);
      return;
    }

    const newUser = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    addToast("Registration successful! Please login.", "success");
    setIsRegistering(false);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    });
  };

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="login-container">
        <div className="login-box">

          {/* 🔥 BRANDING */}
          <h1 className="app-name">ResuGen</h1>
          <p className="tagline">Smart resumes. Better careers.</p>

          <h2>
            {isRegistering ? "Create your account" : "Welcome back"}
          </h2>

          {isRegistering && (
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
          />

          {isRegistering && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          )}

          <button onClick={isRegistering ? handleRegister : handleLogin}>
            {isRegistering
              ? "Create ResuGen Account"
              : "Sign In to ResuGen"}
          </button>

          <p className="toggle-text">
            {isRegistering
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <span onClick={() => setIsRegistering(!isRegistering)}>
              {isRegistering ? "Login" : "Register"}
            </span>
          </p>

          <p
            className="clear-data"
            onClick={() => {
              localStorage.setItem("users", JSON.stringify([]));
              setUsers([]);
              addToast(
                "All data cleared. Please register again.",
                "info"
              );
              setIsRegistering(true);
            }}
          >
            Clear all data
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;