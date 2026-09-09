import React, { useState } from "react";

function CouponFinder() {
  // Platform (amazon / flipkart etc.)
  const [platform, setPlatform] = useState("");

  // Cart items (array)
  const [cart, setCart] = useState([
    { name: "", price: "", quantity: 1, category: "" }
  ]);

  // Result from backend
  const [result, setResult] = useState(null);

  // Handle input change for cart items
  const handleCartChange = (index, field, value) => {
    const updatedCart = [...cart];
    updatedCart[index][field] = value;
    setCart(updatedCart);
  };

  // Add new product row
  const addItem = () => {
    setCart([...cart, { name: "", price: "", quantity: 1, category: "" }]);
  };

  // Send data to backend
  const findBestCoupon = async () => {
    try {
      const token = localStorage.getItem("token");

const response = await fetch("/api/coupon/apply-best-coupon", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify({ platform, cart })
});


      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error finding coupon:", error);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>🎟️ Best Coupon Finder</h2>

      {/* Platform */}
      <input
        type="text"
        placeholder="Platform (amazon / flipkart)"
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
      />

      {/* Cart Items */}
      {cart.map((item, index) => (
        <div key={index} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Product Name"
            value={item.name}
            onChange={(e) => handleCartChange(index, "name", e.target.value)}
          />
          <input
            type="number"
            placeholder="Price"
            value={item.price}
            onChange={(e) => handleCartChange(index, "price", e.target.value)}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={item.quantity}
            onChange={(e) => handleCartChange(index, "quantity", e.target.value)}
          />
          <input
            type="text"
            placeholder="Category"
            value={item.category}
            onChange={(e) => handleCartChange(index, "category", e.target.value)}
          />
        </div>
      ))}

      <button onClick={addItem}>➕ Add Product</button>
      <br /><br />
      <button onClick={findBestCoupon}>🎯 Find Best Coupon</button>

      {/* Result */}
      {result && (
        <div style={{ marginTop: "20px", background: "#e6ffe6", padding: "15px" }}>
          <h3>✅ Best Coupon Result</h3>
          <p><strong>Coupon:</strong> {result.bestCoupon}</p>
          <p><strong>You Saved:</strong> ₹{result.discount}</p>
          <p><strong>Final Price:</strong> ₹{result.finalPrice}</p>
        </div>
      )}
    </div>
  );
}

export default CouponFinder;

