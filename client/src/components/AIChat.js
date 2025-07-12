import { useState } from 'react';

function AIChat() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const askQuestion = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setLoading(true);
    setError('');
    setAnswer('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to ask questions');
        return;
      }

      const response = await fetch('http://localhost:5050/api/ai/question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ question: question.trim() })
      });

      const data = await response.json();
      
      if (response.ok) {
        setAnswer(data.answer);
        setQuestion(''); // Clear the input after successful question
      } else {
        setError(data.error || 'Failed to get answer');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h2>💬 Ask FitCoach AI</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Ask me anything about your health, fitness, or check-in data!
      </p>

      <form onSubmit={askQuestion} style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., 'Why am I feeling tired lately?' or 'What workout should I do today?'"
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
          <button 
            type="submit"
            disabled={loading || !question.trim()}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: loading || !question.trim() ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading || !question.trim() ? 'not-allowed' : 'pointer',
              fontSize: '1rem'
            }}
          >
            {loading ? 'Asking...' : 'Ask'}
          </button>
        </div>
      </form>

      {error && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ 
          padding: '1.5rem', 
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <p>🤖 AI is thinking...</p>
        </div>
      )}

      {answer && !loading && (
        <div style={{
          padding: '1.5rem',
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '1rem'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#007bff' }}>🤖 FitCoach AI Response:</h3>
          <div style={{ 
            whiteSpace: 'pre-wrap',
            lineHeight: '1.6',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            {answer}
          </div>
        </div>
      )}

      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#e7f3ff', 
        borderRadius: '8px',
        fontSize: '0.9rem',
        color: '#0056b3'
      }}>
        <strong>💡 Example questions:</strong>
        <ul style={{ margin: '0.5rem 0 0 1.5rem' }}>
          <li>"How can I improve my sleep quality?"</li>
          <li>"What should I eat to boost my energy?"</li>
          <li>"Why am I feeling stressed lately?"</li>
          <li>"What's the best workout for my current energy level?"</li>
          <li>"How can I recover faster from my workouts?"</li>
        </ul>
      </div>
    </div>
  );
}

export default AIChat; 