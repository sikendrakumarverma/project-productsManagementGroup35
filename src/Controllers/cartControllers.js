const isValidUserData = require('../DataValidation/dataValidationModules');
const { isValidCart } = require('../DataValidation/dataValidation')
const cartModel = require("../Models/cartModel");
const { uploadFile } = require("../Sdb_connection/aws");
const mongoose = require('mongoose')
const productModel = require('../Models/productModel');
require('dotenv').config();


//===============================> (Product data Add to cart by post api) <===========================================//

const AddtoCart = async (req, res) => {
    try {
        let UserId = req.params.userId

        // using destructuring of body data.  
        let data = req.body;
        data.items = JSON.parse(data.items)
        const { userId, items, totalPrice, totalItems } = data;

        let message = isValidCart(data, UserId)
        if (message) {
            return res.status(400).send({ status: false, message: message })
        }

        let Prices = 0
        items.map(async (value)=>{
            let products =await productModel.findById(value.productId)
            let Price = products.price*value.quantity
            Prices += Price
        })

        //Create User data after format 
        const CartData = {
            userId: userId,
            items: items,
            totalPrice: Prices,
            totalItems : items.length,
        };

        const createCart = await cartModel.create(CartData);
        return res.status(201).send({ status: true, message: "Cart created successfully", data: createCart })



    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


//===============================> (Product data update by put api) <===========================================//

const updateCartData = async (req, res) => {
    try {
        let UserId = req.params.userId
        let data = req.body;
        data.removeProduct = prsentInt(data.removeProduct)
        const { removeProduct, updateProduct} = data

        let cartData = await cartModel.findOne({userId: UserId})
        let RemData = cartData.items[removeProduct]
        if(!RemData){
            return res.status(400).send({status: false, message: "Pleace enter valide index."})
        }

        await cartModel.findOneAndUpdate({userId: UserId },{ $pull: { 'items': RemData } }, { multi: true });
        return res.status(200).send({satus: false, message: "Your cart is update successfully"})
          

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



//===============================> (Cart data get by get api) <===========================================//

const getCartData = async (req, res) => {
    try {
        let UserId = req.params.userId

        let data = await cartModel.find({userId: UserId})
        if(!data){
            return res.status(404).send({status: false, message: "pleace create a cart"})
        }
        return res.status(200).send({ status: true, message: "Your cart summary", data: data })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



//===============================> (cART data delete by delete api) <===========================================//

const deleteCartData = async (req, res) => {
    try {
        let UserId = req.params.userId

        let data = await cartModel.find({userId: UserId})
        if(!data){
            return res.status(404).send({status: false, message: "pleace create a cart"})
        }

        await cartModel.findOneAndRemove({userId: UserId})

        return res.status(200).send({ status: true, message: "Your cart is Deleted." })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports = { AddtoCart, updateCartData, getCartData, deleteCartData }