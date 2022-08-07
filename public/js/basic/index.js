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
  resetPassFn,
  updateDetails,
  updatePassword,
} from "./ApiCalls.js";
import { signUpForm, forgotPasswordForm } from "./loginForm.js";
import { addListener } from "./checkOut.js";
import { sellerSideHandle } from "./sellerSide.js";
const input = document.querySelectorAll(".validate-input .input100");
const form = document.querySelector(".validate-form");
const loginBtn = document.querySelector(".loginBtn");
const loginRedirectBtn = document.querySelector(".loginRedirectBtn");
const logoutBtn = document.querySelector(".logoutBtn");
const signUpFormBtn = document.querySelector(".signupForm");
const addCartBtn = document.querySelector(".cartBtn");
const qtyInput = document.querySelectorAll(".qtyInput");
const prodPrice = document.querySelectorAll(".prodPrice");
const rmBtn = document.querySelectorAll(".rmBtn");
const subTotal = document.querySelector(".subTotal");
const tax = document.querySelector(".tax");
const grandTotal = document.querySelector(".grandTotal");
const passwordReset = document.querySelector(".passReset");
const passConfirmReset = document.querySelector(".confirmPassReset");
const resetPassBtn = document.querySelector(".resetPassBtn");
const negoBtn = document.querySelectorAll(".negoBtn");
const forgotPassBtn = document.querySelector(".forgotPass");
const negoPgaccept = document.querySelectorAll(".acceptNegoBtn");
const negoPgreply = document.querySelectorAll(".replyNegoBtn");
const negoPgcancel = document.querySelectorAll(".cancelNegoBtn");
const negoReplyPrice = document.querySelectorAll(".replyValue");
const updateNameInput = document.querySelector(".updateName");
const updateNameBtn = document.querySelector(".updateNameBtn");
const oldPassInput = document.querySelector(".oldPassUpdate");
const newPassInput = document.querySelector(".newPassUpdate");
const confirmPassInput = document.querySelector(".confirmPassUpdate");
const updatePassBtn = document.querySelector(".updatePassBtn");
const negoIds = document.querySelectorAll(".negoId");
addListener();
function showNotification(name, bid, negoStage) {
  var notification = new Notification(" New bid for your Negotiation  ", {
    body: `New bid for The product(${name}) : ₹${bid} `,
    icon: "img/logo.png",
  });
  notification.onclick = () => {
    // console.log(negoStage);
    if (negoStage % 2 != 0) window.location.href = "/negotiate";
    else window.location.href = "/seller_negotiate";
  };
}

if (negoIds) {
  // console.log(negoIds[0].dataset.id);
  var socket = io();
  negoIds.forEach((el) => {
    socket.emit("join", { id: el.dataset.id });
  });
  socket.on("wel", (arg) => {
    console.log(negoIds[0].dataset.user, arg.negoStage);
    if (negoIds[0].dataset.user == "buyer" && arg.negoStage % 2 != 0) {
      if (localStorage.getItem("notify"))
        showNotification(arg.name, arg.bid, arg.negoStage);
      else
        Notification.requestPermission().then((permission) => {
          if (permission == "granted") {
            localStorage.setItem("notify", true);
            showNotification(arg.name, arg.bid, arg.negoStage);
          }
        });
    } else if (negoIds[0].dataset.user == "seller" && arg.negoStage % 2 == 0) {
      if (localStorage.getItem("notify"))
        showNotification(arg.name, arg.bid, arg.negoStage);
      else
        Notification.requestPermission().then((permission) => {
          if (permission == "granted") {
            localStorage.setItem("notify", true);
            showNotification(arg.name, arg.bid, arg.negoStage);
          }
        });
    }
  });
}
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // return check;
  });
}
if (window.location.href.includes("seller")) {
  sellerSideHandle();
}
if (window.location.href.includes("login"))
  loginRedirectBtn.parentElement.parentElement.remove();
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
console.log(logoutBtn);
if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}
if (signUpFormBtn) {
  signUpFormBtn.addEventListener("click", signUpForm);
}
if (forgotPassBtn) {
  forgotPassBtn.addEventListener("click", forgotPasswordForm);
}
if (addCartBtn) {
  const qty = document.getElementById("qtyBox");

  qty.addEventListener("change", () => {
    // console.log(qty.value > qty.dataset.max, qty.value, qty.dataset.max);
    if (Number(qty.value) > Number(qty.max)) qty.value = qty.max;
  });
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
  negoPgreply.forEach((el, i) => {
    el.addEventListener("click", () => {
      let negoReply;
      negoReplyPrice.forEach((replyBtn) => {
        if (replyBtn.dataset.id == el.dataset.id) negoReply = replyBtn;
      });
      // console.log(negoReplyPrice);
      replyNego(el.dataset.id, negoReply.value);
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
if (resetPassBtn) {
  resetPassBtn.addEventListener("click", () => {
    console.log("Click");
    resetPassFn(
      passConfirmReset.dataset.token,
      passwordReset.value,
      passConfirmReset.value
    );
  });
}
if (updateNameBtn) {
  updateNameBtn.addEventListener("click", () => {
    updateDetails(updateNameInput.value);
  });
}
if (updatePassBtn) {
  updatePassBtn.addEventListener("click", () => {
    if (!oldPassInput.value) showValidate(oldPassInput);
    else if (!newPassInput.value) showValidate(newPassInput);
    else if (!confirmPassInput.value) showValidate(confirmPassInput);
    else
      updatePassword(
        oldPassInput.value,
        newPassInput.value,
        confirmPassInput.value
      );
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
