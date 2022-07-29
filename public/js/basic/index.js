"use strict";

import {
  login,
  logout,
  addToCart,
  updateCart,
  rmCart,
  addNego,
  acceptNego,
  cancelNego,
  replyNego,
} from "./ApiCalls.js";
import { signUpForm } from "./loginForm.js";
import { addListener } from "./checkOut.js";
import { sellerSideHandle } from "./sellerSide.js";
const input = document.querySelectorAll(".validate-input .input100");
const form = document.querySelector(".validate-form");
const loginBtn = document.querySelector(".loginBtn");
const logoutBtn = document.querySelector(".logoutBtn");
const signUpFormBtn = document.querySelector(".signupForm");
const addCartBtn = document.querySelector(".cartBtn");
const qtyInput = document.querySelectorAll(".qtyInput");
const prodPrice = document.querySelectorAll(".prodPrice");
const rmBtn = document.querySelectorAll(".rmBtn");
const subTotal = document.querySelector(".subTotal");
const tax = document.querySelector(".tax");
const grandTotal = document.querySelector(".grandTotal");
const negoBtn = document.querySelectorAll(".negoBtn");
const negoPgaccept = document.querySelectorAll(".acceptNegoBtn");
const negoPgreply = document.querySelectorAll(".replyNegoBtn");
const negoPgcancel = document.querySelectorAll(".cancelNegoBtn");
const negoReplyPrice = document.querySelector(".replyValue");
addListener();
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // return check;
  });
}
console.log(window.location.search.slice(6));
if (window.location.href.includes("seller")) {
  sellerSideHandle();
}
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    if (window.location.href.includes("seller")) logout();
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
if (addCartBtn) {
  addCartBtn.addEventListener("click", () => {
    addToCart(window.location.pathname.split("/")[2]);
  });
}
if (qtyInput) {
  qtyInput.forEach((e) => {
    e.addEventListener("change", () => {
      const id = e.dataset.id;
      prodPrice[id].innerHTML = `₹ ${e.value * e.dataset.price}`;
      let sum = 0;
      qtyInput.forEach((e) => {
        sum += Number(e.value * e.dataset.price);
      });
      subTotal.innerHTML = `₹ ${sum}`;
      tax.innerHTML = `₹ ${Math.floor(sum * 0.05)}`;
      grandTotal.innerHTML = `₹ ${sum + Math.floor(sum * 0.05)}`;
      updateCart(e.dataset.prodid, e.value);
    });
  });
}
if (rmBtn) {
  rmBtn.forEach((el, i) => {
    el.addEventListener("click", () => {
      el.parentElement.remove();
      rmCart(i);
    });
  });
}
if (negoBtn) {
  negoBtn.forEach((el, i) => {
    el.addEventListener("click", () => {
      el.parentElement.parentElement.remove();
      addNego(
        el.dataset.id,
        el.dataset.buyer,
        el.dataset.price * el.dataset.qty,
        el.dataset.qty
      );
      rmCart(i);
    });
  });
}
if (negoPgaccept) {
  negoPgaccept.forEach((el) => {
    el.addEventListener("click", () => {
      el.parentElement.parentElement.remove();
      acceptNego(el.dataset.id);
    });
  });
}
if (negoPgreply) {
  negoPgreply.forEach((el) => {
    el.addEventListener("click", () => {
      replyNego(el.dataset.id, negoReplyPrice.value);
    });
  });
}
if (negoPgcancel) {
  negoPgcancel.forEach((el) => {
    el.addEventListener("click", () => {
      el.parentElement.parentElement.remove();
      cancelNego(el.dataset.id);
    });
  });
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
