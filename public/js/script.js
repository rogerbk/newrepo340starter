script.js

const pwdBtn = document.querySelector("#pswdBtn")

pwdBtn.addEventListener("click", function() {
  const pswdInput = document.getElementById("account_password")
  const type = pswdInput.getAttribute("type")
  if (type == "password") {
    pswdInput.setAttribute("type", "text")
    pwdBtn.innerHTML = "Hide Password"
  } else {
    pswdInput.setAttribute("type", "password")
    pwdBtn.innerHTML = "Show Password"
  }
})