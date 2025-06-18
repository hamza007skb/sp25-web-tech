document.addEventListener("DOMContentLoaded", () => {
  const checkoutBtn = document.getElementById("checkoutBtn");

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", async () => {
      const customer_name = document.getElementById("name").value.trim();
      const customer_contact = document.getElementById("contact").value.trim();
      const customer_address = document.getElementById("addr").value.trim();
      const total = parseFloat(checkoutBtn.dataset.total);

      if (!customer_name || !customer_contact || !customer_address) {
        alert("Please fill in all the fields.");
        return;
      }

      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_name,
            customer_contact,
            customer_address,
            total,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          alert("Order placed successfully!");
          window.location.href = "/my-orders";
        } else {
          alert(data.error || "Failed to place order.");
        }
      } catch (err) {
        console.error("Checkout error:", err);
        alert("An error occurred during checkout.");
      }
    });
  }
});
