const signupForm = document.getElementById("signup-form");
if (signupForm) {
  const signupForm = document.getElementById("signup-form");
  const signupError = document.getElementById("error-msg");

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      if (password !== confirmPassword) {
        signupError.textContent = "Passwords do not match!";
        return;
      }

      try {
        const res = await fetch("/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.text();

        if (res.ok) {
          signupError.textContent = "";
          alert("Signup successful!");
          window.location.href = "/login";
        } else {
          signupError.textContent = data || "Signup failed.";
        }
      } catch (error) {
        signupError.textContent = "Error submitting form: " + error.message;
      }
    });
  }
}
