document.getElementById("findCouponBtn").addEventListener("click", () => {

  // Temporary dummy data (frontend-only testing)
  const cart = [
    { name: "Laptop", price: 50000, category: "electronics", quantity: 1 },
    { name: "Shoes", price: 2000, category: "fashion", quantity: 1 }
  ];

  document.getElementById("resultBox").textContent =
    "Cart data ready.\n\n" +
    JSON.stringify(cart, null, 2) +
    "\n\n(Backend not connected yet)";
});
