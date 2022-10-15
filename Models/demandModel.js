const mongoose = require("mongoose");

const demandSchema = new mongoose.Schema({
    productName: [String],
    city:String,
    sales:[Number],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  });

// orderSchema.pre('save', () => {
//   orderController.postOrder();
// });

module.exports =
  mongoose.models.Demand || mongoose.model("Demand", demandSchema);
