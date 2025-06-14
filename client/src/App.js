import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5050/")
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => console.error("Error fetching from backend:", err));
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>FitCoach AI</h1>
      <p>Backend says: {message}</p>
    </div>
  );
}

export default App;
