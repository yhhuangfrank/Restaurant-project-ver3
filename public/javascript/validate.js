const form = document.querySelector("#new-form");
const submitButton = document.querySelector("#submitButton");
form.addEventListener("submit", function onFormSubmitted(event) {
  //- 若表單驗證未通過，則阻止傳送表單
  if (!form.checkValidity()) {
    event.preventDefault();
    event.stopPropagation();
  }
  form.classList.add("was-validated");
});
