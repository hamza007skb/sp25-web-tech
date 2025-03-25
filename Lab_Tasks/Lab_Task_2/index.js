document.addEventListener("DOMContentLoaded", function () {
  const accBtn = document.getElementById("account");
  if (accBtn) {
    accBtn.addEventListener("click", function () {
      window.location.href = "Form/form.html";
    });
  }
});
