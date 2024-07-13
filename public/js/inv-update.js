'use strict'

const form = document.querySelector("#updateForm")
const submitButton = document.querySelector("#updateBtn")

// Function to enable submit button
function enableSubmit() {
    submitButton.removeAttribute("disabled")
}

// Function to disable submit button
function disableSubmit() {
    submitButton.setAttribute("disabled", "")
}

// Add event listeners to all form inputs
form.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('change', checkForm)
})

// Function to check if the form is valid
function checkForm() {
    if (form.checkValidity()) {
        enableSubmit()
    } else {
        disableSubmit()
    }
}

// Initial check
checkForm()