const isValidUserData = require('../DataValidation/dataValidationModules');
const orderModel = require("../Models/orderModel");
const {uploadFile} = require("../Sdb_connection/aws");
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const cartModel = require('../Models/cartModel');
require('dotenv').config();



//===============================> (Cart data get by get api) <===========================================//

const createOrder = async (req, res)=>{
    try{
        let UserId = req.params.userId

        // using destructuring of body data.  
        let cartData =await cartModel.find({userId: UserId})
        let Prices = 0
        let Quantity = 0
        cartData.items.map(async (value)=>{
            let products = await productModel.find(cartData.productId)
            let Price = products.price*value.quantity
            let QTY = products.quantity
            Prices += Price
            Quantity += QTY
        })

        //Create User data after format 
        const orderData = {
            userId: UserId,
            items: items,
            totalPrice: Prices,
            totalItems : cartData.items.length,
            totalQuantity: Quantity
        };

        const createOrder = await orderModel.create(orderData);
        await cartModel.findByIdAndRemove({_id: cartData._id})
        return res.status(201).send({ status: true, message: "Order created successfully", data: createOrder })


    }catch(error){
        return res.status(500).send({status: false, message: error.message})
    }
}



//===============================> (Cart data get by get api) <===========================================//

const updateOrder = async (req, res)=>{
    try{
        let UserId = req.params.userId;
        let Status = req.body;

        let message = isValidUserData.isValidStatus(Status)
        if(!message){
            return res.status(400).send({status: false, message: "Invalid status."})
        }

        let updateData = await orderModel.update({usereId: UserId},{$set: {status: Status}}, {new: true})
        return res.status(200).send({status: false, message: "Status update Successfully", data: updateData})

    }catch(error){
        return res.status(500).send({status: false, message: error.message})
    }
}


module.exports = {createOrder, updateOrder }