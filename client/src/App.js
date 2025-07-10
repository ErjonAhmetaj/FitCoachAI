import { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import CheckInForm from "./components/CheckInForm";
import CheckInList from "./components/CheckInList";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };

  const handleRegister = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  if (!user) {
    return (
      <div>
        <h1 style={{ textAlign: "center" }}>FitCoach AI</h1>
        {showRegister ? (
          <div>
            <Register onRegister={handleRegister} />
            <p style={{ textAlign: "center" }}>
              Already have an account?{" "}
              <button 
                onClick={() => setShowRegister(false)}
                style={{ 
                  background: "none", 
                  border: "none", 
                  color: "#007bff", 
                  cursor: "pointer",
                  textDecoration: "underline"
                }}
              >
                Login here
              </button>
            </p>
          </div>
        ) : (
          <div>
            <Login onLogin={handleLogin} />
            <p style={{ textAlign: "center" }}>
              Don't have an account?{" "}
              <button 
                onClick={() => setShowRegister(true)}
                style={{ 
                  background: "none", 
                  border: "none", 
                  color: "#007bff", 
                  cursor: "pointer",
                  textDecoration: "underline"
                }}
              >
                Register here
              </button>
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        padding: "1rem 2rem",
        backgroundColor: "#f8f9fa",
        borderBottom: "1px solid #dee2e6"
      }}>
        <h1>FitCoach AI</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span>Welcome, {user.username}!</span>
          <button 
            onClick={handleLogout}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      </div>
      <CheckInForm />
      <CheckInList />
    </div>
  );
}

export default App;
