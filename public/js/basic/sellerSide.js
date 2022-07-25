import axios from "axios";
const priceInput = document.querySelectorAll(".priceSel");
const stockInput = document.querySelectorAll(".stockSel");
const updateBtn = document.querySelector(".updateBtnSel");
const rmBtn = document.querySelectorAll(".rmBtnSel");
let price = [],
  stock = [],
  products = [];
export const sellerSideHandle = () => {
  if (updateBtn) {
    updateBtn.addEventListener("click", () => {
      priceInput.forEach((el) => {
        price.push(el.value);
        products.push(el.dataset.id);
      });
      stockInput.forEach((el) => {
        stock.push(el.value);
      });
      updateProducts();
    });
  }
  if (rmBtn) {
    rmBtn.forEach((el, i) => {
      el.addEventListener("click", () => {
        removeProd(priceInput[i].dataset.id);
      });
    });
  }
};

const updateProducts = () => {
  products.forEach(async (el, i) => {
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/product/${el}`,
      data: {
        price: price[i],
        stockLeft: stock[i],
      },
    });
    if (res.data.status === "success") {
      location.reload();
    }
  });
};
const removeProd = async (id) => {
  const res = await axios({
    method: "DELETE",
    url: `/api/v1/product/${id}`,
  });
  if (res.data.status === "success") {
    location.reload();
  }
};
