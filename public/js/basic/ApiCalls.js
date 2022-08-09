/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";
const addCartBtn = document.querySelector(".cartBtn");
export const login = async (email, password) => {
  const input = document.querySelectorAll(".validate-input");

  try {
    let res;
    if (!window.location.href.includes("seller")) {
      res = await axios({
        method: "POST",
        url: "/api/v1/user/login",
        data: {
          email,
          password,
        },
      });
    } else {
      res = await axios({
        method: "POST",
        url: "/api/v1/seller/login",
        data: {
          email,
          password,
        },
      });
    }
    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully!");
      window.setTimeout(() => {
        if (!window.location.href.includes("seller")) {
          if (window.location.search.includes("prod"))
            location.assign(`/product/${window.location.search.slice(6)}`);
          else location.assign("/");
        } else {
          location.assign("/seller_products");
        }
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
    if (!window.location.href.includes("seller")) {
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
    } else {
      const res = await axios({
        method: "POST",
        url: "/api/v1/seller/signup",
        data: { name, email, password, passwordConfirm },
      });
      if (res.data.status === "success") {
        showAlert("success", "SignedUp successfully!");
        window.setTimeout(() => {
          location.assign("/seller_products");
        }, 200);
      }
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
export const addNego = async (id, buyer, price, qty) => {
  try {
    const res = await axios({
      method: "POST",
      url: `/api/v1/negotiation/placeBid/`,
      data: {
        product: id,
        buyer: buyer,
        startingPrice: price,
        currentBid: price,
        qty,
      },
    });
    if (res.data.status === "success") {
      // const cart = document.querySelector(".cartProducts");
      // if (cart) location.reload();
      // else window.location.href = "/overview";
    }
  } catch (err) {
    console.log("ERRRRORR", err);
    // showAlert("error", err.response.data.message);
  }
  return true;
};
export const acceptNego = async (negoId) => {
  try {
    const res = await axios({
      method: "POST",
      url: `/api/v1/negotiation/acceptBid/${negoId}`,
    });
    console.log(res);
    if (res.data.status === "success") {
      // const cart = document.querySelector(".cartProducts");
      // if (cart) location.reload();
      window.location.href = `/order_placed/${res.data.data.data._id}`;
    }
  } catch (err) {
    console.log("ERRRRORR", err);
    // showAlert("error", err.response.data.message);
  }
  return true;
};
export const cancelNego = async (negoId) => {
  try {
    const res = await axios({
      method: "POST",
      url: `/api/v1/negotiation/cancelBid/${negoId}`,
    });
    if (res.data.status === "success") {
      console.log("REMOVED");
      const nego = document.querySelector(".negoRow");
      if (nego) location.reload();
      else window.location.href = "/";
    }
  } catch (err) {
    console.log("ERRRRORR", err);
    // showAlert("error", err.response.data.message);
  }
  return true;
};
export const replyNego = async (negoId, replyPrice) => {
  try {
    const res = await axios({
      method: "POST",
      url: `/api/v1/negotiation/replyBid/${negoId}`,
      data: { replyPrice },
    });
    if (res.data.status === "success") {
      // location.reload();
      // const nego = document.querySelector(".negoRow");
      // console.log(nego);
      // if (nego) location.reload();
      // else window.location.href = "/";
    }
  } catch (err) {
    console.log("ERRRRORR", err);
    // showAlert("error", err.response.data.message);
  }
  return true;
};
export const forgPassFn = async () => {
  const emailInput = document.querySelector(".emailInpt");
  const email = emailInput.value;
  const input = document.querySelectorAll(".validate-input");

  try {
    let res;
    if (!window.location.href.includes("seller")) {
      res = await axios({
        method: "POST",
        url: "api/v1/buyer/forgotPassword",
        data: {
          email,
        },
      });
    } else {
      console.log(email);
      res = await axios({
        method: "POST",
        url: "api/v1/seller/forgotPassword",
        data: {
          email,
        },
      });
    }
    if (res.data.status === "success") {
      location.reload();
    }
  } catch (err) {
    showValidate(input[0]);
    input[0].dataset.validate = err.response.data.message;
    return false;
    // showAlert("error", err.response.data.message);
  }
  console.log("sendmail");
};
export const updateDetails = async (name) => {
  const input = document.querySelectorAll(".validate-input");
  try {
    let res;
    if (!window.location.href.includes("seller")) {
      res = await axios({
        method: "PATCH",
        url: "api/v1/buyer/updateMe",
        data: {
          name,
        },
      });
    } else {
      res = await axios({
        method: "PATCH",
        url: "api/v1/seller/updateMe",
        data: {
          name,
        },
      });
    }
    if (res.data.status === "success") {
      location.reload();
    }
  } catch (err) {
    showValidate(input[0]);
    input[0].dataset.validate = err.response.data.message;
    return false;
    // showAlert("error", err.response.data.message);
  }
};
export const updatePassword = async (
  passwordCurrent,
  password,
  passwordConfirm
) => {
  const input = document.querySelectorAll(".validate-input");
  try {
    let res;
    if (!window.location.href.includes("seller")) {
      res = await axios({
        method: "PATCH",
        url: "api/v1/buyer/updateMyPassword",
        data: { passwordCurrent, password, passwordConfirm },
      });
    } else {
      res = await axios({
        method: "PATCH",
        url: "api/v1/seller/updateMyPassword",
        data: { passwordCurrent, password, passwordConfirm },
      });
    }
    if (res.data.status === "success") {
      showAlert("success", "Password Changed successfully!");
      window.setTimeout(() => {
        location.reload();
      }, 300);
    }
  } catch (err) {
    console.log(err.response.data);
    showValidate(input[1]);
    input[1].dataset.validate = err.response.data.message;
    return false;
    // showAlert("error", err.response.data.message);
  }
};
export const resetPassFn = async (token, password, passwordConfirm) => {
  // const emailInput = document.querySelector(".emailInpt");
  // const email = emailInput.value;
  const input = document.querySelectorAll(".validate-input");

  try {
    let res;
    if (!window.location.href.includes("seller")) {
      res = await axios({
        method: "PATCH",
        url: `/api/v1/buyer/resetPassword/${token}`,
        data: {
          password,
          passwordConfirm,
        },
      });
    } else {
      console.log(email);
      res = await axios({
        method: "PATCH",
        url: `/api/v1/seller/resetPassword/${token}`,
        data: {
          password,
          passwordConfirm,
        },
      });
    }
    if (res.data.status === "success") {
      console.log("SUCCESS");
      if (!window.location.href.includes("seller"))
        window.location.href = "/login";
      else window.location.href = "/seller-login";
    }
  } catch (err) {
    showValidate(input[0]);
    // if (err.response.data.message.includes("Cast to string failed"))
    input[0].dataset.validate = err.response.data.message;
    return false;
    // showAlert("error", err.response.data.message);
  }
  console.log("sendmail");
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
      const url = [
        "account",
        "myCart",
        "checkOut",
        "editAccount",
        "myOrders",
        "negotiate",
        "seller_products",
      ];

      const hasUrl = url.map((e) => {
        return window.location.href.includes(e);
      });
      if (hasUrl.includes(true)) window.location.href = "/";
      else if (!window.location.href.includes("seller-login"))
        location.reload();
    }
  } catch (err) {
    console.log(err.response);
    showAlert("error", "Error logging out! Try again.");
  }
};
export const filterPrice = async (start, end) => {
  let url = window.location;
  if (!url.search) url = url.search + `?price[gte]=${start}&price[lte]=${end}`;
  else if (url.search.includes("type") && url.search.includes("price[gte]")) {
    url =
      url.search.slice(0, url.search.indexOf("price[gte]") - 1) +
      `&price[gte]=${start}&price[lte]=${end}`;
  } else if (url.search.includes("sort"))
    url = `?price[gte]=${start}&price[lte]=${end}`;
  else url = `?price[gte]=${start}&price[lte]=${end}`;
  // url.searchParams.set("price[gte]", "3");
  window.location.href = url;
  // window.location.href = `${window.location.search}?price[gte]=${start}&price[lte]=${end}`;
};
export const withinDistance = async (dist) => {
  navigator.geolocation.getCurrentPosition((position) => {
    window.location.href = `/productsWithin/${position.coords.latitude},${position.coords.longitude},${dist}?sort=-price&price[gte]=20&price[lte]=60`;
  });
};
