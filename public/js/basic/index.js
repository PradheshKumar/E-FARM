"use strict";

import { login, logout } from "./login.js";
const input = document.querySelectorAll(".validate-input .input100");
const form = document.querySelector(".validate-form");
const logoutBtn = document.querySelector(".logoutBtn");
console.log(logoutBtn);
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
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

    // return check;
  });
}
if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
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
  console.log($(input).parent());
  var thisAlert = $(input).parent();
  $(thisAlert).addClass("alert-validate");
}

function hideValidate(input) {
  var thisAlert = $(input).parent();

  $(thisAlert).removeClass("alert-validate");
}
