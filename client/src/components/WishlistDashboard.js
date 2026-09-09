import React, { useEffect, useState, useCallback } from 'react';

function WishlistDashboard() {
  const [items, setItems] = useState([]);

  const fetchWishlist = useCallback(async () => {
    try {
      const res = await fetch('/api/wishlist');
      const data = await res.json();

      console.log("Wishlist API response:", data);

      // Ensure items is always an array
      if (Array.isArray(data)) {
        setItems(data);
      } else if (Array.isArray(data.items)) {
        setItems(data.items);
      } else {
        setItems([]);
      }

    } catch (err) {
      console.error('Error fetching wishlist:', err.message);
      setItems([]); // prevent crash
    }
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/wishlist/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        setItems(prevItems => prevItems.filter(item => item._id !== id));
      } else {
        alert(`❌ Failed to delete item: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error deleting item:', err.message);
      alert('❌ Error deleting item.');
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return (
    <div>
      <h2>🧾 Your Wishlist</h2>

      {!Array.isArray(items) || items.length === 0 ? (
        <p>No items yet. Add some links!</p>
      ) : (
        <ul>
          {items.map(item => (
            <li key={item._id} style={{ marginBottom: '1rem' }}>
              <strong>{item.title}</strong><br />

              <a href={item.link} target="_blank" rel="noopener noreferrer">
                View Product
              </a><br />

              <span>Current Price: ₹{item.currentPrice}</span><br />
              <span>Previous Price: ₹{item.previousPrice}</span><br />

              {item.previousPrice > item.currentPrice && (
                <span style={{ color: 'green', fontWeight: 'bold' }}>
                  🔻 Price Dropped by ₹{item.previousPrice - item.currentPrice}
                </span>
              )}

              {item.previousPrice < item.currentPrice && (
                <span style={{ color: 'red', fontWeight: 'bold' }}>
                  🔺 Price Increased by ₹{item.currentPrice - item.previousPrice}
                </span>
              )}

              <br />

              <button
                onClick={() => handleDelete(item._id)}
                style={{
                  marginTop: '0.5rem',
                  backgroundColor: '#ff4d4d',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                ❌ Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default WishlistDashboard;


// import React, { useEffect, useState } from 'react';

// function WishlistDashboard() {
//   const [items, setItems] = useState([]);

//   const fetchWishlist = async () => {
//     try {
//       const res = await fetch('/api/wishlist'); // Use full URL if no proxy
//       const data = await res.json();
//       setItems(data);
//     } catch (err) {
//       console.error('Error fetching wishlist:', err.message);
//     }
//   };

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm('Are you sure you want to delete this item?');
//     if (!confirmDelete) return;

//     try {
//       const res = await fetch(`/api/wishlist/${id}`, {
//         method: 'DELETE',
//       });

//       const data = await res.json();
//       console.log('Delete response:', data);

//       if (res.ok) {
//         setItems(prevItems => prevItems.filter(item => item._id !== id));
//       } else {
//         console.error('Failed to delete item:', data.error || 'Unknown error');
//         alert(`❌ Failed to delete item: ${data.error || 'Unknown error'}`);
//       }
//     } catch (err) {
//       console.error('Error deleting item:', err.message);
//       alert('❌ Error deleting item. Check console for details.');
//     }
//   };

//   useEffect(() => {
//     fetchWishlist();
//   }, []);

//   return (
//     <div>
//       <h2>🧾 Your Wishlist</h2>
//       {items.length === 0 ? (
//         <p>No items yet. Add some links!</p>
//       ) : (
//         <ul>
//           {items.map(item => (
//             <li key={item._id} style={{ marginBottom: '1rem' }}>
//               <strong>{item.title}</strong><br />
//               <a href={item.link} target="_blank" rel="noopener noreferrer">View Product</a><br />
//               <span>Current Price: ₹{item.currentPrice}</span><br />
//               <span>Previous Price: ₹{item.previousPrice}</span><br />
//               {item.previousPrice > item.currentPrice && (
//                 <span style={{ color: 'green', fontWeight: 'bold' }}>
//                   🔻 Price Dropped by ₹{item.previousPrice - item.currentPrice}
//                 </span>
//               )}
//               {item.previousPrice < item.currentPrice && (
//                 <span style={{ color: 'red', fontWeight: 'bold' }}>
//                   🔺 Price Increased by ₹{item.currentPrice - item.previousPrice}
//                 </span>
//               )}
//               <br />
//               <button
//                 onClick={() => handleDelete(item._id)}
//                 style={{ marginTop: '0.5rem', backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '0.5rem', cursor: 'pointer' }}
//               >
//                 ❌ Delete
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default WishlistDashboard;
