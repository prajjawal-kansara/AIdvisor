// src/App.js
import React, { useState } from 'react';
import './App.css';

function App() {
  const [userPrompt, setUserPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const examples = [
    'I want an AI tool to generate content for my social media.',
    'I need help automating business workflows.',
    'I want to create voiceovers for videos.',
    'I need help debugging my Python code.',
    'I want to summarize long research papers.'
  ];

  const handleSubmit = async () => {
    if (!userPrompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const res = await fetch('http://localhost:3000/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userPrompt }),
      });

      const data = await res.json();
      if (data.success) {
        setResults(data);
      } else {
        setError(data.error || 'An error occurred.');
      }
    } catch (err) {
      setError(err.message || 'Server not reachable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>🧠 AI Recommender</h1>
        <textarea
          placeholder="Describe what you need an AI tool for..."
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
        ></textarea>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Getting Recommendations...' : 'Get AI Recommendations'}
        </button>

        <div className="examples">
          <p>Try examples:</p>
          {examples.map((ex, idx) => (
            <span key={idx} onClick={() => setUserPrompt(ex)}>
              {ex}
            </span>
          ))}
        </div>

        {error && <div className="error">{error}</div>}

        {results && (
          <div className="results">
            <h2>{results.summary}</h2>
            {results.recommendations.map((tool, i) => (
              <div className="recommendation" key={i}>
                <h3>{tool.toolName}</h3>
                <div className="match">{tool.matchScore}% match</div>
                <p><strong>Why:</strong> {tool.reasoning}</p>
                <p><strong>Best for:</strong> {tool.bestFor}</p>
                <p><strong>Consider:</strong> {tool.considerations}</p>
                {tool.toolDetails && (
                  <>
                    <p><strong>Pricing:</strong> {tool.toolDetails.pricing}</p>
                    <p><strong>Category:</strong> {tool.toolDetails.category}</p>
                  </>
                )}
              </div>
            ))}
            <p><strong>Next Steps:</strong> {results.nextSteps}</p>
            <p className="tools-count">Analyzed {results.totalToolsConsidered} tools</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
