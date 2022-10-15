const Demand = require("../Models/demandModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("../utils/appError");
const mongoose = require("mongoose");
const Product = require("../Models/productModel");
exports.newDemand = 
  catchAsync(async (products,buyer,productsQty) => {let city;
    if(buyer.location.city)
        city = buyer.location.city;
    else city="Unknown"
    let demand = (await Demand.findOne({city}));
    if(demand){products.forEach((el,i)=>{
          
         if(demand.productName.includes(el.name))
           {demand.sales[demand.productName.indexOf(el.name)] +=productsQty[i];
           
       }
        else {
            demand.productName.push(el.name);
         demand.sales.push(productsQty[i]);
        }
     })
     console.log(await Demand.findByIdAndUpdate(demand.id,demand));
    }
    else{demand ={city:"",productName:[],sales:[]};
        if(buyer.location.city)
            demand.city = buyer.location.city;
        else
            demand.city ="UnKnown"
        products.forEach((el,i)=>{
          
      
        demand.productName.push(el.name);
        demand.sales.push(productsQty[i]);
       
    })
        console.log(await Demand.create(demand));}
    

    
  });