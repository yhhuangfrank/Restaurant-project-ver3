const registerForm = document.querySelector("#register-form");
if (registerForm) {
  registerForm.addEventListener("submit", function onFormSubmitted(event) {
    //- 若表單驗證未通過，則阻止傳送表單
    if (!registerForm.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }
    registerForm.classList.add("was-validated");
  });
}
const loginForm = document.querySelector("#login-form");
if (loginForm) {
  loginForm.addEventListener("submit", function onFormSubmitted(event) {
    //- 若表單驗證未通過，則阻止傳送表單
    if (!loginForm.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }
    loginForm.classList.add("was-validated");
  });
}

const newForm = document.querySelector("#new-form");
if (newForm) {
  newForm.addEventListener("submit", function onFormSubmitted(event) {
    //- 若表單驗證未通過，則阻止傳送表單
    if (!newForm.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }
    newForm.classList.add("was-validated");
  });
}
