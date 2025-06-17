const loginForm = document.getElementById("login-form");
if (loginForm) {
  const loginError = document.getElementById("error-msg");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = loginForm.username.value.trim();
    const password = loginForm.password.value.trim();

    if (!username || !password) {
      loginError.textContent = "Both fields are required.";
      return;
    }

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json(); // Make sure backend sends JSON

      if (res.ok) {
        window.location.href = "/";
      } else {
        loginError.textContent = data.message || "Login failed. Try again.";
      }
    } catch (err) {
      console.error("Login error:", err);
      loginError.textContent = "Something went wrong. Please try again.";
    }
  });
}
