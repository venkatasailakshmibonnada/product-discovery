import { useState, useEffect } from 'react';
import ProductList from './components/ProductList';
import AskBox from './components/AskBox';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function App() {
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [aiSummary, setAiSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAiResult, setIsAiResult] = useState(false);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        setAllProducts(data.products);
        setDisplayedProducts(data.products);
      })
      .catch(() => setFetchError('⚠️ Backend not running! Open new terminal → cd backend → npm run dev'))
      .finally(() => setInitialLoading(false));
  }, []);

  const handleCategoryChange = (cat) => {
    setCategoryFilter(cat);
    setIsAiResult(false);
    setAiSummary('');
    setDisplayedProducts(
      cat === 'all' ? allProducts : allProducts.filter(p => p.category === cat)
    );
  };

  const handleAiResult = (result) => {
    if (!result) return;
    setDisplayedProducts(result.products);
    setAiSummary(result.summary);
    setIsAiResult(true);
    setCategoryFilter('all');
  };

  const handleClearAi = () => {
    setIsAiResult(false);
    setAiSummary('');
    setDisplayedProducts(allProducts);
  };

  const categories = ['all', ...new Set(allProducts.map(p => p.category))];

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.title}>🛍️ Product Discovery</h1>
        <p style={styles.subtitle}>Browse our catalog or use AI to find exactly what you need</p>
      </header>

      <main style={styles.main}>
        {fetchError && <div style={styles.errorBanner}>{fetchError}</div>}

        <AskBox onResult={handleAiResult} onLoading={setLoading} apiUrl={API_URL} />

        {aiSummary && (
          <div style={styles.summaryBox}>
            <div>
              <span style={styles.aiLabel}>🤖 AI Recommendation</span>
              <p style={styles.summaryText}>{aiSummary}</p>
            </div>
            <button onClick={handleClearAi} style={styles.clearBtn}>✕ Show All</button>
          </div>
        )}

        {!isAiResult && (
          <div style={styles.filterSection}>
            <p style={styles.filterLabel}>Browse by Category:</p>
            <div style={styles.filters}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  style={{
                    ...styles.filterBtn,
                    ...(categoryFilter === cat ? styles.filterBtnActive : {}),
                  }}
                >
                  {cat === 'all' ? '🏷️ All'
                    : cat === 'laptop' ? '💻 Laptop'
                    : cat === 'headphones' ? '🎧 Headphones'
                    : cat === 'tablet' ? '📱 Tablet'
                    : cat === 'accessories' ? '🖱️ Accessories'
                    : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={styles.countRow}>
          <p style={styles.count}>
            {isAiResult
              ? `🤖 AI found ${displayedProducts.length} product(s)`
              : `Showing ${displayedProducts.length} product(s)`}
          </p>
          {isAiResult && (
            <button onClick={handleClearAi} style={styles.backBtn}>← Back to all</button>
          )}
        </div>

        <ProductList products={displayedProducts} loading={loading || initialLoading} />
      </main>

      <footer style={styles.footer}>
        <p>Built with React + Node.js + Groq 🚀</p>
      </footer>
    </div>
  );
}

const styles = {
  app: { minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: "'Segoe UI', system-ui, sans-serif", display: 'flex', flexDirection: 'column' },
  header: { background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', padding: '50px 24px', textAlign: 'center' },
  title: { margin: '0 0 10px 0', fontSize: '36px', fontWeight: '800', color: '#fff' },
  subtitle: { margin: 0, fontSize: '17px', color: 'rgba(255,255,255,0.85)' },
  main: { flex: 1, maxWidth: '1150px', width: '100%', margin: '0 auto', padding: '36px 24px' },
  errorBanner: { backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '14px 18px', color: '#dc2626', fontSize: '14px', marginBottom: '24px' },
  summaryBox: { backgroundColor: '#eef2ff', border: '1.5px solid #c7d2fe', borderRadius: '14px', padding: '18px 22px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' },
  aiLabel: { display: 'block', fontSize: '12px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' },
  summaryText: { margin: 0, color: '#3730a3', fontSize: '15px', lineHeight: '1.5' },
  clearBtn: { background: 'none', border: '1.5px solid #a5b4fc', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', color: '#4338ca', fontSize: '13px', whiteSpace: 'nowrap' },
  filterSection: { marginBottom: '24px' },
  filterLabel: { fontSize: '13px', color: '#94a3b8', fontWeight: '500', marginBottom: '10px' },
  filters: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  filterBtn: { padding: '9px 20px', border: '1.5px solid #e2e8f0', borderRadius: '25px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: '#475569' },
  filterBtnActive: { backgroundColor: '#6366f1', color: '#fff', border: '1.5px solid #6366f1' },
  countRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  count: { color: '#94a3b8', fontSize: '14px', margin: 0 },
  backBtn: { background: 'none', border: 'none', color: '#6366f1', fontSize: '14px', cursor: 'pointer', fontWeight: '500' },
  footer: { textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: '13px', borderTop: '1px solid #e2e8f0', backgroundColor: '#fff' },
};