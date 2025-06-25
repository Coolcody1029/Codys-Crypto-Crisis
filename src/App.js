import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { charts as allCharts } from './charts';

function App() {
  const [username, setUsername] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [portfolio, setPortfolio] = useState(10000);
  const [current, setCurrent] = useState(0);
  const [wager, setWager] = useState(1000);
  const [leverage, setLeverage] = useState(1);
  const [result, setResult] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);

  const filteredCharts = allCharts.filter(chart => chart.difficulty === difficulty);
  const chart = filteredCharts[current % filteredCharts.length];
  const MAX_LEVERAGE = 100;

  // Play/pause audio on mute toggle
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      if (!isMuted) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMuted]);

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
      setShowFeedback(false);
    } else if (choice === "no-trade") {
      feedback = "⏭️ Skipped.";
      setShowFeedback(false);
    } else {
      newPortfolio -= value;
      feedback = correct === "no-trade"
        ? `❌ No Trade Zone! -$${value}`
        : `❌ Incorrect! -$${value}`;
      setShowFeedback(true);
    }

    setPortfolio(newPortfolio);
    setResult(feedback);
    setCurrent(prev => prev + 1);
    setShowHint(false);
  };

  const resetGame = () => {
    setDifficulty("");
    setCurrent(0);
    setPortfolio(10000);
    setWager(1000);
    setLeverage(1);
    setResult("");
    setShowHint(false);
    setShowFeedback(false);
  };

  return (
    <div style={{ backgroundColor: "#0D0D0D", color: "#E6E6FA", minHeight: "100vh", padding: 20, fontFamily: "sans-serif", position: "relative" }}>
      {/* Background Music Audio */}
      <audio
        ref={audioRef}
        src={process.env.PUBLIC_URL + '/Lacrimosa.mp3'}
        loop
        autoPlay
      />

      {/* Mute / Unmute Button top right */}
      <button
        onClick={() => setIsMuted(prev => !prev)}
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          backgroundColor: "#222",
          color: "#E6E6FA",
          border: "1px solid #6A0DAD",
          padding: "8px 12px",
          cursor: "pointer",
          zIndex: 1000,
          borderRadius: 4,
          userSelect: "none",
        }}
        aria-label={isMuted ? "Unmute Music" : "Mute Music"}
        title={isMuted ? "Unmute Music" : "Mute Music"}
      >
        {isMuted ? "🔈" : "🔊"}
      </button>

      <AnimatePresence mode="wait">
        {!username ? (
          <motion.div
            key="name-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}
          >
            <h1>Welcome to Cody's Crypto Crisis</h1>
            <p>Enter your name to begin:</p>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your Name"
            />
            <button style={{ marginTop: 10 }} onClick={() => setUsername(nameInput)}>
              Continue
            </button>
          </motion.div>
        ) : !difficulty ? (
          <motion.div
            key="difficulty-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <h2>Select Your Difficulty</h2>
            <div style={{ display: "flex", gap: 10 }}>
              {['Beginner', 'Intermediate', 'Expert'].map(level => (
                <button key={level} onClick={() => setDifficulty(level)}>{level}</button>
              ))}
            </div>
            <button
              onClick={() => setShowHowToPlay(prev => !prev)}
              style={{ marginTop: 20 }}
            >
              📘 How to Play
            </button>
            <button
              onClick={() => setShowGlossary(prev => !prev)}
              style={{ marginTop: 10 }}
            >
              📚 Pattern Glossary
            </button>
            <AnimatePresence>
              {showHowToPlay && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{ marginTop: 20, maxWidth: 500, textAlign: "center" }}
                >
                  <p>
                    To play, choose your difficulty. Your task is based on the 4-hour candles provided.
                    Look at the chart and predict whether it's appropriate to Long, Short, or No Trade based on the TA pattern shown.
                  </p>
                </motion.div>
              )}
              {showGlossary && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{ marginTop: 20, maxWidth: 600, textAlign: "left" }}
                >
                  {['Beginner', 'Intermediate', 'Expert'].map(level => (
                    <div key={level} style={{ marginBottom: 10 }}>
                      <h4>{level}</h4>
                      <ul>
                        {allCharts.filter(c => c.difficulty === level).map((c, i) => (
                          <li key={i}><strong>{c.pattern}</strong> - Correct Move: {c.correct}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="game-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h1>Cody's Crypto Crisis</h1>
            <h2>Player: {username} | Portfolio: ${portfolio}</h2>

            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <img
                src={`charts/${chart.file}`}
                alt="chart"
                width="640"
                height="360"
                style={{ border: "2px solid #6A0DAD" }}
              />
              <img
                src={process.env.PUBLIC_URL + '/phantom_2.png'}
                alt="Right side"
                width="200"
                height="360"
                style={{ border: "2px solid #6A0DAD", objectFit: "contain" }}
              />
            </div>

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

            <div style={{ marginBottom: 10 }}>
              <button onClick={() => handleChoice("Long")} style={{ marginRight: 10 }}>📈 Long</button>
              <button onClick={() => handleChoice("Short")} style={{ marginRight: 10 }}>📉 Short</button>
              <button onClick={() => handleChoice("no-trade")}>🚫 No Trade</button>
            </div>

            <div style={{ marginBottom: 10 }}>
              <button
                onClick={() => setShowHint(true)}
                style={{ backgroundColor: "#222", color: "#E6E6FA", border: "1px solid #6A0DAD", padding: "5px 10px" }}
              >
                💡 Hint
              </button>
              {showHint && (
                <div style={{ marginTop: 10, color: "#FFD700" }}>
                  Pattern: <strong>{chart.pattern}</strong>
                </div>
              )}
            </div>

            {showFeedback && (
              <div style={{ backgroundColor: "#330000", padding: 10, border: "1px solid #FF5555", marginBottom: 10 }}>
                <strong>Why?</strong> This pattern is a <em>{chart.pattern}</em>, which typically indicates a {chart.correct === "Long" ? "bullish" : chart.correct === "Short" ? "bearish" : "neutral"} setup. Study the formation and volume before acting.
              </div>
            )}

            <h3>{result}</h3>

            <button
              onClick={resetGame}
              style={{ marginTop: 20, backgroundColor: "#222", color: "#E6E6FA", border: "1px solid #6A0DAD", padding: "5px 10px" }}
            >
              🔙 Back to Menu
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
