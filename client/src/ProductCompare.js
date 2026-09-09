import React, { useState } from 'react';

function ProductCompare() {
  const [link, setLink] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleCompare = async () => {
    setError('');
    setResults(null);

    try {
      const res = await fetch('/api/product/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch comparison data');
      }

      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error('Error:', err.message);
      setError('Something went wrong. Please check the link and try again.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🔗 Product Link Comparison</h2>
      <input
        type="text"
        placeholder="Paste product link (e.g., Amazon or Flipkart)"
        value={link}
        onChange={e => setLink(e.target.value)}
        style={{ width: '60%', padding: '0.5rem' }}
      />
      <button onClick={handleCompare} style={{ marginLeft: '1rem' }}>
        Compare Prices
      </button>

      {error && (
        <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>
      )}

      {results && (
        <div style={{ marginTop: '2rem' }}>
          {results.image && (
            <img
              src={results.image}
              alt="Product"
              style={{
                maxWidth: '200px',
                maxHeight: '200px',
                objectFit: 'contain',
                marginBottom: '1rem',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '4px'
              }}
            />
          )}
          <h3>Product: {results.product}</h3>
          <ul>
            {results.prices.map((item, index) => (
              <li key={index}>
                {item.platform}: ₹{item.price} —{' '}
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  View
                </a>
                {results.bestDeal === item.platform && (
                  <span style={{ color: 'green', fontWeight: 'bold', marginLeft: '1rem' }}>
                    ✅ Best Deal
                  </span>
                )}
                {item.platform.includes('Google') && (
                  <span style={{ color: 'gray', fontSize: '0.9rem' }}>
                    {' '} (opens Google search)
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProductCompare;
