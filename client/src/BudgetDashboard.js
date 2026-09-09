import React, { useEffect, useState } from 'react';
import PurchaseForm from '../components/PurchaseForm';
import PurchaseList from '../components/PurchaseList';

function BudgetDashboard() {
  const [purchases, setPurchases] = useState([]);

  const fetchPurchases = () => {
    fetch('http://localhost:5000/api/purchase')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPurchases(data);
        else setPurchases([]);
      })
      .catch((err) => console.error('Error fetching purchases:', err));
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/purchase/${id}`, {
        method: 'DELETE',
      });
      fetchPurchases(); // ✅ refresh after delete
    } catch (err) {
      console.error('Error deleting purchase:', err);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  return (
    <div>
      <h1>Spending Tracker Dashboard</h1>
      <PurchaseForm onPurchaseAdded={fetchPurchases} />
      <PurchaseList purchases={purchases} onDelete={handleDelete} />
    </div>
  );
}

export default BudgetDashboard;
