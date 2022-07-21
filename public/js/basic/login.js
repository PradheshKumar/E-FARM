/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";

export const login = async (email, password) => {
  const input = document.querySelectorAll(".validate-input");

  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/buyer/login",
      data: {
        email,
        password,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showValidate(input[0]);
    input[0].dataset.validate = err.response.data.message;
    return false;
    // showAlert("error", err.response.data.message);
  }
  return true;
};
function showValidate(input) {
  console.log($(input));
  var thisAlert = $(input);
  $(thisAlert).addClass("alert-validate");
}

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/v1/users/logout",
    });
    if ((res.data.status = "success")) location.reload(true);
  } catch (err) {
    console.log(err.response);
    showAlert("error", "Error logging out! Try again.");
  }
};
