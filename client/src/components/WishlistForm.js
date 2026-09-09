import React, { useState } from 'react';

function WishlistForm({ onItemAdded }) {
  const [link, setLink] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setMessage('');

    if (!link.trim()) {
      setMessage('❌ Please paste a valid product link');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const res = await fetch('/api/wishlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ✅ IMPORTANT
        },
        body: JSON.stringify({ link }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ Added to wishlist`);
        setLink('');
        onItemAdded(); // refresh wishlist
      } else {
        setMessage(`❌ ${data.error || 'Failed to add item'}`);
      }
    } catch (err) {
      console.error('Error:', err.message);
      setMessage('❌ Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3>📌 Add to Wishlist</h3>

      <input
        type="text"
        placeholder="Paste product link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        style={{ width: '60%', padding: '0.5rem' }}
        disabled={loading}
      />

      <button
        onClick={handleAdd}
        disabled={loading}
        style={{ marginLeft: '1rem' }}
      >
        {loading ? 'Adding...' : 'Add'}
      </button>

      <button
        onClick={() => setLink('')}
        style={{ marginLeft: '0.5rem' }}
      >
        Clear
      </button>

      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}

export default WishlistForm;



// import React, { useState } from 'react';

// function WishlistForm({ onItemAdded }) {
//   const [link, setLink] = useState('');
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleAdd = async () => {
//     setMessage('');
//     if (!link.trim()) {
//       setMessage('❌ Please paste a valid product link');
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch('/api/wishlist/add', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ link }),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         setMessage(`✅ Added: ${data.item.title}`);
//         setLink('');
//         onItemAdded(); // Refresh dashboard
//       } else {
//         setMessage(`❌ ${data.error || 'Failed to add item'}`);
//       }
//     } catch (err) {
//       console.error('Error:', err.message);
//       setMessage('❌ Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ marginBottom: '2rem' }}>
//       <h3>📌 Add to Wishlist</h3>
//       <input
//         type="text"
//         placeholder="Paste product link"
//         value={link}
//         onChange={e => setLink(e.target.value)}
//         style={{ width: '60%', padding: '0.5rem' }}
//         disabled={loading}
//       />
//       <button onClick={handleAdd} disabled={loading} style={{ marginLeft: '1rem' }}>
//         {loading ? 'Adding...' : 'Add'}
//       </button>
//       <button onClick={() => setLink('')} style={{ marginLeft: '0.5rem' }}>
//         Clear
//       </button>
//       {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
//     </div>
//   );
// }

// export default WishlistForm;



