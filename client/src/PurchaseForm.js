import React, { useState } from 'react';

function PurchaseForm() {
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
const purchase = { item, amount: Number(amount), category };

  try {
    const response = await fetch('http://localhost:5000/api/purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(purchase),
    });

    const data = await response.json();
    console.log('Saved to backend:', data);

    // Clear form after submission
    setItem('');
    setAmount('');
    setCategory('');
  } catch (error) {
    console.error('Error saving purchase:', error);
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add a Purchase</h2>
      <input
        type="text"
        placeholder="Item Name"
        value={item}
        onChange={(e) => setItem(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button type="submit">Add Purchase</button>
    </form>
  );
}

export default PurchaseForm;

// import React, { useState } from 'react';

// function PurchaseForm({ onPurchaseAdded }) {
//   const [item, setItem] = useState('');
//   const [amount, setAmount] = useState('');
//   const [category, setCategory] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const purchase = { item, amount: Number(amount), category };

//     try {
//       const response = await fetch('http://localhost:5000/api/purchase', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(purchase),
//       });

//       const data = await response.json();
//       console.log('Saved to backend:', data);

//       setItem('');
//       setAmount('');
//       setCategory('');

//       if (onPurchaseAdded) onPurchaseAdded(); // ✅ trigger refresh
//     } catch (error) {
//       console.error('Error saving purchase:', error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Add a Purchase</h2>
//       <input
//         type="text"
//         placeholder="Item Name"
//         value={item}
//         onChange={(e) => setItem(e.target.value)}
//       />
//       <input
//         type="number"
//         placeholder="Amount"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="Category"
//         value={category}
//         onChange={(e) => setCategory(e.target.value)}
//       />
//       <button type="submit">Add Purchase</button>
//     </form>
//   );
// }

// export default PurchaseForm;

