import ProductCard from './ProductCard';

export default function ProductList({ products, loading }) {
  if (loading) {
    return (
      <div style={styles.center}>
        <p style={styles.loadingText}>⏳ Loading products...</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div style={styles.center}>
        <p style={styles.emptyText}>😕 No products found. Try a different search.</p>
      </div>
    );
  }

  return (
    <div style={styles.grid}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  center: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  loadingText: {
    color: '#64748b',
    fontSize: '16px',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: '16px',
  },
};