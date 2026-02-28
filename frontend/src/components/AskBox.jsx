import { useState } from 'react';

export default function AskBox({ onResult, onLoading }) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  const suggestions = [
    'Budget laptops under $500',
    'Best gaming laptop',
    'Wireless headphones',
    'Tablets for drawing',
  ];

  const handleSubmit = async (q) => {
    const trimmed = (q || query).trim();
    if (!trimmed) return;
    setError('');
    setIsAsking(true);
    onLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        onResult(null);
      } else {
        onResult(data);
      }
    } catch {
      setError('❌ Cannot connect to server. Make sure backend is running on port 5001.');
      onResult(null);
    } finally {
      setIsAsking(false);
      onLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🤖 Ask AI Assistant</h2>
      <p style={styles.subtext}>
        Type a natural language query and let AI find the best products for you.
      </p>

      <div style={styles.inputRow}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="e.g. Show me budget laptops or What's good for gaming?"
          style={styles.input}
          disabled={isAsking}
        />
        <button
          onClick={() => handleSubmit()}
          style={{ ...styles.button, opacity: isAsking ? 0.7 : 1 }}
          disabled={isAsking}
        >
          {isAsking ? 'Asking...' : 'Ask AI'}
        </button>
      </div>

      <div style={styles.suggestions}>
        <span style={styles.suggestLabel}>Try: </span>
        {suggestions.map(s => (
          <button
            key={s}
            onClick={() => { setQuery(s); handleSubmit(s); }}
            style={styles.chip}
            disabled={isAsking}
          >
            {s}
          </button>
        ))}
      </div>

      {error && <div style={styles.errorBox}>⚠️ {error}</div>}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#fff',
    border: '2px solid #e0e7ff',
    borderRadius: '16px',
    padding: '28px',
    marginBottom: '32px',
    boxShadow: '0 4px 20px rgba(99,102,241,0.08)',
  },
  heading: { margin: '0 0 6px 0', color: '#0f172a', fontSize: '22px', fontWeight: '700' },
  subtext: { color: '#64748b', fontSize: '14px', margin: '0 0 18px 0' },
  inputRow: { display: 'flex', gap: '10px', marginBottom: '14px' },
  input: {
    flex: 1, padding: '13px 18px', borderRadius: '10px',
    border: '1.5px solid #cbd5e1', fontSize: '15px', outline: 'none',
    backgroundColor: '#f8fafc',
  },
  button: {
    padding: '13px 28px', backgroundColor: '#6366f1', color: '#fff',
    border: 'none', borderRadius: '10px', fontSize: '15px',
    fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap',
  },
  suggestions: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
  suggestLabel: { fontSize: '13px', color: '#94a3b8', fontWeight: '500' },
  chip: {
    padding: '5px 14px', backgroundColor: '#f1f5f9',
    border: '1px solid #e2e8f0', borderRadius: '20px',
    fontSize: '13px', color: '#475569', cursor: 'pointer',
  },
  errorBox: {
    marginTop: '14px', backgroundColor: '#fef2f2',
    border: '1px solid #fecaca', borderRadius: '8px',
    padding: '12px 16px', color: '#dc2626', fontSize: '14px',
  },
};