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
const addRent = document.querySelector(".plRent");

const pckProd = document.querySelectorAll(".pckProd");
const rtnProd = document.querySelectorAll(".rtnProd");
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
      addProduct();
      let flag = 0;
      addProdInput.forEach((el) => {
        if (!el.value) {
          $(el.parentElement).addClass("alert-validate");
          flag = 1;
          return;
        }
      });
      if (flag == 1) return;
    });
  }
  if (prodImages) {
    // let images = [/];
    prodImages.addEventListener("change", async () => {
      if (prodImages.files.length != 0)
        prodImageLabel.innerHTML = `${prodImages.files.length} files uploaded`;
      else prodImageLabel.innerHTML = "No File Choosen";
    });
  }
  if (addRent) {
    addRent.addEventListener("click", async () => {
      const res = await axios({
        method: "POST",
        url: `/api/v1/rent/createRent`,
        data: {
          product: addRent.dataset.id,
          buyer: addRent.dataset.buyer,
          seller: addRent.dataset.seller,
        },
      });

      if (res.data.status === "success") {
        window.location.href = "/MyRents";
      }
    });
  }
  if (pckProd) {
    pckProd.forEach((el) => {
      el.addEventListener("click", async () => {
        const res = await axios({
          method: "PATCH",
          url: `/api/v1/rent/startRentDate/${el.dataset.id}`,
        });
        if (res.data.status === "success") {
          window.location.reload();
        }
      });
    });
  }
  if (rtnProd) {
    rtnProd.forEach((el) => {
      el.addEventListener("click", async () => {
        const res = await axios({
          method: "PATCH",
          url: `/api/v1/rent/endRentDate/${el.dataset.id}`,
        });
        if (res.data.status === "success") {
          window.location.reload();
        }
      });
    });
  }
};

const addProduct = async () => {
  const form = new FormData();

  form.append("name", prodName.value);
  form.append("price", prodPrice.value);
  form.append("costPer", prodCostPer.value);
  form.append("summary", prodSummary.value);

  form.append("images", prodImages.files[0]);
  if (prodImages.files[1]) form.append("images", prodImages.files[1]);
  if (prodImages.files[2]) form.append("images", prodImages.files[2]);
  form.append("type", prodType.value);
  form.append("stockLeft", prodStockLeft.value);

  const res = await axios({
    method: "POST",
    url: `/api/v1/product/addProduct`,
    data: form,
  });

  if (res.data.status === "success") {
    window.location.href = "/seller_products";
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
