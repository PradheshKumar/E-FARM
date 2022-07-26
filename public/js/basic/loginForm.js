const loginForm = document.querySelector(".login100-form");

import { signUp } from "./ApiCalls.js";
let input;

const markup = `<span class="login100-form-title p-b-53">Sign Up </span>
  <div class="p-t-31 p-b-9"><span class="txt1">Name</span></div>
  <div class="wrap-input100 validate-input" data-validate="User Name is required">
    <input class="input100" type="text" name="username"/><span class="focus-input100"></span>
  </div>
  <div class="p-t-31 p-b-9"><span class="txt1">Email Address</span></div>
  <div class="wrap-input100 validate-input" data-validate="Email Id is required">
    <input class="input100" type="text" name="email"/><span class="focus-input100"></span>
  </div>
  <div class="p-t-13 p-b-9"><span class="txt1">Password</span>
  <div class="wrap-input100 validate-input" data-validate="Password is required">
    <input class="input100" type="password" name="pass"/><span class="focus-input100"></span>
  </div>
  <div class="p-t-13 p-b-9"><span class="txt1">Confirm Password</span>
  <div class="wrap-input100 validate-input" data-validate="Password is required">
    <input class="input100" type="password" name="ConfirmPass"/><span class="focus-input100"></span>
  </div>
  <div class="container-login100-form-btn m-t-17 signupBtn">
    <button type="button" class="login100-form-btn signupBtn" >Sign Up</button>
  </div>`;

export const signUpForm = (e) => {
  e.preventDefault();
  loginForm.innerHTML = markup;
  input = document.querySelectorAll(".validate-input .input100");
  document.querySelector(".signupBtn").addEventListener("click", signUpFn);
  input.forEach((el) => {
    el.addEventListener("focus", () => {
      hideValidate(el);
    });
  });
};
const signUpFn = (e) => {
  e.preventDefault();
  e.stopImmediatePropagation();
  let check = true;
  input.forEach((i) => {
    if (validate(i) == false) {
      showValidate(i);
      check = false;
    }
  });
  if (check) {
    const name = input[0].value;
    const email = input[1].value;
    const password = input[2].value;
    const Cpassword = input[3].value;
    signUp(name, email, password, Cpassword);
  } else {
    return false;
  }
};
function validate(input) {
  if ($(input).attr("type") == "email" || $(input).attr("name") == "email") {
    if (
      $(input)
        .val()
        .trim()
        .match(
          /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/
        ) == null
    ) {
      return false;
    }
  } else {
    if ($(input).val().trim() == "") {
      return false;
    }
  }
}
$(".validate-form .input100").each(function () {
  $(this).focus(function () {
    hideValidate(this);
  });
});

function showValidate(input) {
  var thisAlert = $(input).parent();
  $(thisAlert).addClass("alert-validate");
}
function hideValidate(input) {
  var thisAlert = $(input).parent();

  $(thisAlert).removeClass("alert-validate");
}
