import axios from "axios";
const delToggle = document.querySelectorAll(".delToggle");
const payToggle = document.querySelectorAll(".payToggle");
let price = document.querySelector(".finalPrice");
if (price) price = Number(price.innerHTML.replace("₹", ""));
const placeOrderBtn = document.querySelector(".plOrder");
const priceTxt = document.querySelector(".finalPrice");
const products = document.querySelectorAll(".prodName");

import { showCheckout } from "./stripe.js";
let finalPrice = price;
let prodId = [],
  prodQty = [],
  pay,buyer,delTime = 400000000;
if (products.length != 0) {
  products.forEach((e) => prodId.push(e.dataset.id));
  products.forEach((e) => prodQty.push(e.dataset.qty));
  buyer = products[0].dataset.buyer;
}
export const addListener = () => {
  if (delToggle) {
    delToggle.forEach((e) => {
      e.addEventListener("click", () => {
        if (e.dataset.id == 1) {
          delTime = 400000000;
          priceTxt.innerHTML = `₹ ${price}`;
        } else if (e.dataset.id == 2) {
          delTime = 200000000;
          priceTxt.innerHTML = `₹ ${price + 50}`;
        } else if (e.dataset.id == 3) {
          delTime = 100000000;
          priceTxt.innerHTML = `₹ ${price + 100}`;
        }

        finalPrice = Number(
          document.querySelector(".finalPrice").innerHTML.replace("₹", "")
        );
      });
    });
  }
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", () => {
      placeOrder(delTime);
    });
  }
  if (payToggle) {
    payToggle.forEach((e) => {
      e.addEventListener("click", () => {
        if (e.dataset.id == 1) {
          pay = 1;
          priceTxt.innerHTML = `₹ ${price}`;
        } else if (e.dataset.id == 2) {
          pay = 2;
          priceTxt.innerHTML = `₹ ${price + 50}`;
        }

        finalPrice = Number(
          document.querySelector(".finalPrice").innerHTML.replace("₹", "")
        );
      });
    });
  }
};
const placeOrder = async (delTime) => {
  try {
    const res = await axios({
      method: "POST",
      url: `/api/v1/order/newOrder`,
      data: {
        products: prodId,
        buyer,
        totalPrice: finalPrice,
        productsQty: prodQty,
        estimateDelivery: Date.now() + delTime,
      },
    });
    if (res.data.status === "success") {
      if (pay == 1) showCheckout(res.data.data.data._id);
      else window.location.href = `/order_placed/${res.data.data.data._id}`;
    }
  } catch (err) {
    console.log("ERRRRORR", err);
    // showAlert("error", err.response.data.message);
  }
  return true;
};
