const imgs = document.querySelectorAll(".img-select a");
const sort = document.querySelector(".sortDropDown");
const search = document.querySelectorAll(".searchInput");

const imgBtns = [...imgs];
let url = new URL(window.location.href);

let imgId = 1;
if (sort) {
  if (window.location.href.slice(-6) == "-price") sort.value = 2;
  else if (window.location.href.slice(-6) == "=price") sort.value = 3;
  else if (window.location.href.slice(-4) == "name") sort.value = 4;
  else if (window.location.href.slice(-7) == "Average") sort.value = 5;
}

imgBtns.forEach((imgItem) => {
  imgItem.addEventListener("click", (event) => {
    event.preventDefault();
    imgId = imgItem.dataset.id;
    slideImage();
  });
});

search.forEach((e) => {
  e.addEventListener("change", searchFn);
});
sort.addEventListener("change", sortFn);
function sortFn() {
  url.searchParams.set("sort", "3");
  if (sort.value == 1) {
    url.searchParams.delete("sort");
  } else if (sort.value == 2) {
    url.searchParams.set("sort", "-price");
  } else if (sort.value == 3) {
    url.searchParams.set("sort", "price");
  } else if (sort.value == 4) {
    url.searchParams.set("sort", "name");
  } else {
    url.searchParams.set("sort", "Average");
  }

  window.location.href = url;
}
function slideImage() {
  const displayWidth = document.querySelector(
    ".img-showcase img:first-child"
  ).clientWidth;

  document.querySelector(".img-showcase").style.transform = `translateX(${
    -(imgId - 1) * displayWidth
  }px)`;
}
function searchFn(e) {
  window.location.href = `/search/${e.target.value}`;
  console.log(e.target.value);
}

window.addEventListener("resize", slideImage);
