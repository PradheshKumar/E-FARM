"use strict";

import { login, logout } from "./login.js";
import { signUpForm } from "./loginForm.js";
const input = document.querySelectorAll(".validate-input .input100");
const form = document.querySelector(".validate-form");
const loginBtn = document.querySelector(".loginBtn");
const logoutBtn = document.querySelector(".logoutBtn");
const signUpFormBtn = document.querySelector(".signupForm");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // return check;
  });
}
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    let check = true;
    input.forEach((i) => {
      if (validate(i) == false) {
        showValidate(i);
        check = false;
      }
    });
    if (check) {
      const email = input[0].value;
      const password = input[1].value;
      login(email, password);
    } else {
      return false;
    }
  });
}
if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}
if (signUpFormBtn) {
  signUpFormBtn.addEventListener("click", signUpForm);
}
$(".validate-form .input100").each(function () {
  $(this).focus(function () {
    hideValidate(this);
  });
});

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

function showValidate(input) {
  var thisAlert = $(input).parent();
  $(thisAlert).addClass("alert-validate");
}

function hideValidate(input) {
  var thisAlert = $(input).parent();

  $(thisAlert).removeClass("alert-validate");
}
