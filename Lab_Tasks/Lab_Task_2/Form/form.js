const username = document.getElementById("username");
const email = document.getElementById("email");
const contact = document.getElementById("contact");
const addr = document.getElementById("address");
const expiry = document.getElementById("expiry");

function validateUsername(username) {
  if (username) {
    return /^[A-Za-z]+$/.test(username);
  }
  return false;
}
function validateEmail(email) {
  if (email) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
  }
  return false;
}
function validateContact(contact) {
  if (!contact.trim()) {
    return true;
  }
  return /^[0-9]{11}$/.test(contact);
}
function validateExpiry(date) {
  if (!date.trim()) {
    return true;
  }
  const today = new Date();
  const inputDate = new Date(date + "-01");
  return inputDate > today;
}
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (validateInputs()) {
    alert("Signup successful!");
    form.submit();
  }
});

function validateInputs() {
  let isValid = true;
  if (!validateUsername(username.value.trim())) {
    setError(username, "Input valid username");
    isValid = false;
  }
  if (!validateEmail(email.value.trim())) {
    setError(email, "Input valid email");
    isValid = false;
  }
  if (!validateContact(contact.value.trim())) {
    setError(contact, "Input valid contact");
    isValid = false;
  }
  if (!validateExpiry(expiry.value.trim())) {
    setError(expiry, "Input correct expiry");
    isValid = false;
  }
  if (isValid) {
    onSuccess();
  }
}

function setError(element, message) {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");
  errorDisplay.innerText = message;
}
function onSuccess() {
  alert("Form Has been submitted successfully.");
  window.location.href = "../newlook.html";
}
