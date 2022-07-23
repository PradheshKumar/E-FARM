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
      if (window.location.href.includes("account")) window.location.href = "/";
      else location.reload(true);
    }
  } catch (err) {
    console.log(err.response);
    showAlert("error", "Error logging out! Try again.");
  }
};
