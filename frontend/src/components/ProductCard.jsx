export default function ProductCard({ product }) {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.category}>{product.category}</span>
        <span style={styles.price}>${product.price}</span>
      </div>
      <h3 style={styles.name}>{product.name}</h3>
      <p style={styles.description}>{product.description}</p>
      <div style={styles.tags}>
        {product.tags.map(tag => (
          <span key={tag} style={styles.tag}>#{tag}</span>
        ))}
      </div>
    </div>
  );
}

const styles = {
  card: {
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  category: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6366f1',
    backgroundColor: '#eef2ff',
    padding: '3px 10px',
    borderRadius: '20px',
    textTransform: 'capitalize',
  },
  price: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
  },
  name: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 8px 0',
  },
  description: {
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.5',
    margin: '0 0 12px 0',
  },
  tags: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  tag: {
    fontSize: '12px',
    color: '#94a3b8',
    backgroundColor: '#f1f5f9',
    padding: '2px 8px',
    borderRadius: '4px',
  },
};