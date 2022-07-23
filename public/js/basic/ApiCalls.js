/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";
const addCartBtn = document.querySelector(".cartBtn");

export const login = async (email, password) => {
  const input = document.querySelectorAll(".validate-input");

  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/user/login",
      data: {
        email,
        password,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 200);
    }
  } catch (err) {
    showValidate(input[0]);
    input[0].dataset.validate = err.response.data.message;
    return false;
    // showAlert("error", err.response.data.message);
  }
  return true;
};
export const signUp = async (name, email, password, passwordConfirm) => {
  const input = document.querySelectorAll(".validate-input");
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/user/signup",
      data: { name, email, password, passwordConfirm },
    });
    if (res.data.status === "success") {
      showAlert("success", "SignedUp successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 200);
    }
  } catch (err) {
    showValidate(input[0]);
    input[0].dataset.validate = err.response.data.message;
    return false;
    // showAlert("error", err.response.data.message);
  }
  return true;
};
export const addToCart = async (prodId) => {
  const qty = document.getElementById("qtyBox").value;
  if (qty != 0)
    try {
      const res = await axios({
        method: "POST",
        url: `/api/v1/buyer/addCart/${prodId}/${qty}`,
      });
      if (res.data.status === "success") {
        addCartBtn.parentElement.innerHTML = "ADDED";
        location.reload();
      }
    } catch (err) {
      console.log("ERRRRORR", err);
      // showAlert("error", err.response.data.message);
    }
  return true;
};
export const rmCart = async (id) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/buyer/rmCart/${id}`,
    });
    if (res.data.status === "success") {
      console.log("REMOVED");
      const cart = document.querySelector(".cartProducts");
      if (cart) location.reload();
      else window.location.href = "/overview";
    }
  } catch (err) {
    console.log("ERRRRORR", err);
    // showAlert("error", err.response.data.message);
  }
  return true;
};
function showValidate(input) {
  var thisAlert = $(input);
  $(thisAlert).addClass("alert-validate");
}
export const updateCart = async (prodId, qty) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/buyer/updateCart/${prodId}/${qty}`,
    });
    if (res.data.status === "success") {
      // addCartBtn.parentElement.innerHTML = "ADDED";
      // location.reload();
    }
  } catch (err) {
    console.log("ERRRRORR", err);
    // showAlert("error", err.response.data.message);
  }
  return true;
};

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/v1/user/logout",
    });
    if ((res.data.status = "success")) {
      const url = ["account", "myCart", "checkOut"];

      const hasUrl = url.map((e) => {
        console.log(e);
        return window.location.href.includes(e);
      });
      if (hasUrl.includes(true)) window.location.href = "/";
      else location.reload(true);
    }
  } catch (err) {
    console.log(err.response);
    showAlert("error", "Error logging out! Try again.");
  }
};
