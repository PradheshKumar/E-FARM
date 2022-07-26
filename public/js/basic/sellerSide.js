import axios from "axios";
const priceInput = document.querySelectorAll(".priceSel");
const stockInput = document.querySelectorAll(".stockSel");
const updateBtn = document.querySelector(".updateBtnSel");
const rmBtn = document.querySelectorAll(".rmBtnSel");
const prodName = document.querySelector(".prodName");
const prodPrice = document.querySelector(".prodPrice");
const prodCostPer = document.querySelector(".prodcostPer");
const prodSummary = document.querySelector(".prodSummary");
const prodType = document.querySelector(".prodType");
const prodStockLeft = document.querySelector(".prodStockLeft");
const prodImages = document.querySelector(".prodImage");
const prodImageLabel = document.querySelector(".prodImagelabel");
const addProdBtn = document.querySelector(".prodBtn");
const addProdInput = document.querySelectorAll(".prodInput");
let price = [],
  stock = [],
  products = [],
  img = [];
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
  if (addProdBtn) {
    addProdBtn.addEventListener("click", (e) => {
      e.preventDefault();
      let flag = 0;
      addProdInput.forEach((el) => {
        console.log("repeat");
        if (!el.value) {
          $(el.parentElement).addClass("alert-validate");
          flag = 1;
          return;
        }
      });
      if (flag == 1) return;
      console.log("Send");
      console.log(prodImages.value);
      addProduct();
    });
  }
  if (prodImages) {
    // let images = [/];
    prodImages.addEventListener("change", async () => {
      if (prodImages.files.length != 0)
        prodImageLabel.innerHTML = `${prodImages.files.length} files uploaded`;
      else prodImageLabel.innerHTML = "No File Choosen";
      // for (let i = 0; i < prodImages.files.length; i++)
      //   images.push(prodImages.files.item(i));
      // console.log(document.querySelector("input[type=file]")["files"][0]);
      // var file = document.querySelector("input[type=file]")["files"][0];
      // const file = images;
      const getBase64 = (file) =>
        new Promise((resolve, reject) => {
          console.log(file);
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (err) => reject(err);
        });
      // const images = await Promise.all(
      for (let j = 0; j < prodImages.files.length; j++) {
        img.push(getBase64(prodImages.files[j]));
      }
      img = await Promise.all(img);
      img = img.map((el) => el.split(",")[1]);

      // );
      console.log(img);
    });
  }
};

const addProduct = async () => {
  console.log("sending");
  const res = await axios({
    method: "POST",
    url: `/api/v1/seller/addProduct`,
    data: {
      name: prodName.value,
      price: prodPrice.value,
      costPer: prodCostPer.value,
      summary: prodSummary.value,
      img,
      type: prodType.value,
      stockLeft: prodStockLeft.value,
    },
  });

  if (res.data.status === "success") {
    console.log("receiver");
    window.location.href("/seller_products");
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
