/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";
// const stripe = Stripe("pk_test_BUkd0ZXAj6m0q0jMyRgBxNns00PPtgvjjr");

export const showCheckout = async (orderId, role) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `/api/v1/${
        role == "seller" ? "farmOrder" : "order"
      }/checkOutPage/${orderId}`
    );
    window.location.href = session.data.data;

    // 2) Create checkout form + chanre credit card
    // await stripe.redirectToCheckout({
    //   sessionId: session.data.session.id,
    // });
  } catch (err) {
    console.log(err);
    showAlert("error", err);
  }
};
