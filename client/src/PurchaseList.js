import React, { useEffect, useState } from 'react';
import SpendingChart from './SpendingChart';

function PurchaseList() {
  const [purchases, setPurchases] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

useEffect(() => {
  fetch('http://localhost:5000/api/purchase')
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data)) {
        setPurchases(data);
      } else {
        console.error('Expected array but got:', data);
        setPurchases([]);
      }
    })
    .catch((err) => console.error('Error fetching purchases:', err));
}, []);


  // ✅ Filter out invalid entries
  const validPurchases = purchases.filter(
    (p) => typeof p.amount === 'number' && !isNaN(p.amount)
  );

  // ✅ Apply category filter
  const filteredPurchases =
    selectedCategory === 'All'
      ? validPurchases
      : validPurchases.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  // 🧮 Calculate total spending for filtered purchases
  const totalSpent = filteredPurchases.reduce((sum, p) => sum + p.amount, 0);

  // 🗑️ Handle delete
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/purchase/${id}`, {
        method: 'DELETE',
      });
      setPurchases(purchases.filter((p) => p._id !== id));
    } catch (err) {
      console.error('Error deleting purchase:', err);
    }
  };

  return (
    <div>
      <h2>Purchase History</h2>

      {/* 🔽 Category Filter Dropdown */}
      <label htmlFor="categoryFilter">Filter by Category: </label>
      <select
        id="categoryFilter"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        style={{ marginBottom: '20px', padding: '5px' }}
      >
        <option value="All">All</option>
        <option value="Food">Food</option>
        <option value="Electronics">Electronics</option>
        <option value="Clothing">Clothing</option>
      </select>

      <h3>Total Spent: ₹{totalSpent}</h3>

      <ul>
        {filteredPurchases.map((p) => (
          <li key={p._id}>
            {p.item ? `${p.item} — ₹${p.amount} (${p.category})` : `₹${p.amount} (${p.category})`}
            <button
              onClick={() => handleDelete(p._id)}
              style={{
                marginLeft: '10px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <SpendingChart purchases={validPurchases} />

    </div>
  );
}

export default PurchaseList;

// import React, { useState } from 'react';
// import SpendingChart from './SpendingChart';

// function PurchaseList({ purchases, onDelete }) {
//   const [selectedCategory, setSelectedCategory] = useState('All');

//   // ✅ Filter out invalid entries
//   const validPurchases = purchases.filter(
//     (p) => typeof p.amount === 'number' && !isNaN(p.amount)
//   );

//   // ✅ Apply category filter
//   const filteredPurchases =
//     selectedCategory === 'All'
//       ? validPurchases
//       : validPurchases.filter(
//           (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
//         );

//   // 🧮 Calculate total spending for filtered purchases
//   const totalSpent = filteredPurchases.reduce((sum, p) => sum + p.amount, 0);

//   return (
//     <div>
//       <h2>Purchase History</h2>

//       {/* 🔽 Category Filter Dropdown */}
//       <label htmlFor="categoryFilter">Filter by Category: </label>
//       <select
//         id="categoryFilter"
//         value={selectedCategory}
//         onChange={(e) => setSelectedCategory(e.target.value)}
//         style={{ marginBottom: '20px', padding: '5px' }}
//       >
//         <option value="All">All</option>
//         <option value="Food">Food</option>
//         <option value="Electronics">Electronics</option>
//         <option value="Clothing">Clothing</option>
//       </select>

//       <h3>Total Spent: ₹{totalSpent}</h3>

//       <ul>
//         {filteredPurchases.map((p) => (
//           <li key={p._id}>
//             {p.item
//               ? `${p.item} — ₹${p.amount} (${p.category})`
//               : `₹${p.amount} (${p.category})`}
//             <button
//               onClick={() => onDelete(p._id)}
//               style={{
//                 marginLeft: '10px',
//                 backgroundColor: '#dc3545',
//                 color: 'white',
//                 border: 'none',
//                 padding: '5px 10px',
//                 borderRadius: '4px',
//                 cursor: 'pointer',
//               }}
//             >
//               Delete
//             </button>
//           </li>
//         ))}
//       </ul>

//       {/* 📊 Spending chart */}
//       <SpendingChart purchases={validPurchases} />
//     </div>
//   );
// }

// export default PurchaseList;
