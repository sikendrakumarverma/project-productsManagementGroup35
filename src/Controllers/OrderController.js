const isValidUserData = require('../DataValidation/dataValidationModules');
const orderModel = require("../Models/orderModel");
const mongoose = require('mongoose')
const cartModel = require('../Models/cartModel');
require('dotenv').config();



//===============================> (Cart data get by get api) <===========================================//

const createOrder = async (req, res)=>{
    try{
        let UserId = req.params.userId

        // using destructuring of body data.  
        let cartData =await cartModel.findOne({userId: UserId})
        if(!cartData){
            return res.status(400).send({status: false, message: "Your cart not exist."})
        }
        if(cartData.items.length == 0){
            return res.status(400).send({status: false, message: "product add in your cart."})
        }
        let Quantity = 0
        for(let i = 0; i < cartData.items.length; i++){
            let QTY = cartData.items[i].quantity
            Quantity += QTY
        }

        //Create User data after format 
        const orderData = {
            userId: UserId,
            items: cartData.items,
            totalPrice: cartData.totalPrice,
            totalItems : cartData.totalItems,
            totalQuantity: Quantity
        };
        return res.send({data: orderData})
        const createOrder = await orderModel.create(orderData);
        await cartModel.findOneAndUpdate({userId: UserId}, {$set: {items: [], totalPrice: 0, totalItems: 0}},{new: true})
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
        if(message){
            return res.status(400).send({status: false, message: message})
        }
        await orderModel.findOneAndUpdate({usereId: UserId},{$set: {status: Status}}, {new: true})
        let updateData = await orderModel.findOne({usereId: UserId})
        return res.status(200).send({status: false, message: "Status update Successfully", data: updateData})

    }catch(error){
        return res.status(500).send({status: false, message: error.message})
    }
}


module.exports = {createOrder, updateOrder }