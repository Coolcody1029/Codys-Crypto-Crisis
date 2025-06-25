import React, { useState } from 'react';
import { charts } from './charts';

function App() {
  const [username, setUsername] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [portfolio, setPortfolio] = useState(10000);
  const [current, setCurrent] = useState(0);
  const [wager, setWager] = useState(1000);
  const [leverage, setLeverage] = useState(1);
  const [result, setResult] = useState("");
  const [showHint, setShowHint] = useState(false); // 🔍 NEW STATE

  const chart = charts[current];
  const MAX_LEVERAGE = 100;

  const handleChoice = (choice) => {
    const correct = chart.correct;
    const validLeverage = Math.min(leverage, MAX_LEVERAGE);
    const validWager = Math.min(wager, portfolio);
    const value = validWager * validLeverage;
    let newPortfolio = portfolio;
    let feedback = "";

    if (choice === correct) {
      newPortfolio += value;
      feedback = `✅ Correct! +$${value}`;
    } else if (choice === "no-trade") {
      feedback = "⏭️ Skipped.";
    } else if (correct === "no-trade" && choice !== "no-trade") {
      newPortfolio -= value;
      feedback = `❌ No Trade Zone! -$${value}`;
    } else {
      newPortfolio -= value;
      feedback = `❌ Incorrect! -$${value}`;
    }

    setPortfolio(newPortfolio);
    setResult(feedback);
    setCurrent((prev) => (prev + 1) % charts.length);
    setShowHint(false); // reset hint each round
  };

  if (!username) {
    return (
      <div
        style={{
          backgroundColor: "#0D0D0D",
          color: "#E6E6FA",
          padding: 20,
          fontFamily: "sans-serif",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>Welcome to Cody's Crypto Crisis</h1>
        <p>Enter your name to begin:</p>
        <input
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          placeholder="Your Name"
        />
        <button style={{ marginLeft: 10 }} onClick={() => setUsername(nameInput)}>
          Start
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#0D0D0D",
        color: "#E6E6FA",
        padding: 20,
        fontFamily: "sans-serif",
        minHeight: "100vh",
      }}
    >
      <h1>Cody's Crypto Crisis</h1>
      <h2>
        Player: {username} | Portfolio: ${portfolio}
      </h2>

      {/* Chart and side image */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <img
          src={`charts/${chart.file}`}
          alt="chart"
          width="640"
          height="360"
          style={{ border: "2px solid #6A0DAD" }}
        />
        <img
          src="/phantom_2.png"
          alt="Right side"
          width="200"
          height="360"
          style={{ border: "2px solid #6A0DAD", objectFit: "contain" }}
        />
      </div>

      {/* Margin & Leverage */}
      <div style={{ margin: "10px 0" }}>
        <label>Margin: $</label>
        <input
          type="number"
          value={wager}
          onChange={(e) => setWager(Number(e.target.value))}
        />
        <label style={{ marginLeft: 10 }}>Leverage: </label>
        <input
          type="number"
          value={leverage}
          onChange={(e) => setLeverage(Number(e.target.value))}
        />
        <small style={{ marginLeft: 10, color: "#aaa" }}>(Max 100x)</small>
      </div>

      {/* Trade buttons */}
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => handleChoice("Long")} style={{ marginRight: 10 }}>
          📈 Long
        </button>
        <button onClick={() => handleChoice("Short")} style={{ marginRight: 10 }}>
          📉 Short
        </button>
        <button onClick={() => handleChoice("no-trade")}>🚫 No Trade</button>
      </div>

      {/* Hint section */}
      <div style={{ marginBottom: 10 }}>
        <button
          onClick={() => setShowHint(true)}
          style={{
            backgroundColor: "#222",
            color: "#E6E6FA",
            border: "1px solid #6A0DAD",
            padding: "5px 10px",
          }}
        >
          💡 Hint
        </button>
        {showHint && (
          <div style={{ marginTop: 10, color: "#FFD700" }}>
            Pattern: <strong>{chart.pattern}</strong>
          </div>
        )}
      </div>

      <h3>{result}</h3>
    </div>
  );
}

export default App;
