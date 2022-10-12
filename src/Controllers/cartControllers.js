const isValidUserData = require('../DataValidation/dataValidationModules');
const {isValidCart} = require('../DataValidation/dataValidation')
const cartModel = require("../Models/cartModel");
const {uploadFile} = require("../Sdb_connection/aws");
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
require('dotenv').config();


//===============================> (Product data Add to cart by post api) <===========================================//

const AddtoCart = async (req, res)=>{
    try{
        let UserId = req.params.userId //userId, items(productId, quantity), totalPrice, totalItems

        // using destructuring of body data.  
        let data = req.body;
        const {userId, items, totalPrice, totalItems} = data;
        const {productId, quantity} = items[0] 

        let message = isValidCart(data, UserId)
        if (message) {
            return res.status(400).send({ status: false, message: message })
        }

    }catch(error){
        return res.status(500).send({status: false, message: error.message})
    }
}


//===============================> (Product data update by put api) <===========================================//

const updateCartData = async (req, res)=>{
    try{

    }catch(error){
        return res.status(500).send({status: false, message: error.message})
    }
}



//===============================> (Cart data get by get api) <===========================================//

const getCartData = async (req, res)=>{
    try{

    }catch(error){
        return res.status(500).send({status: false, message: error.message})
    }
}



//===============================> (cART data delete by delete api) <===========================================//

const deleteCartData = async (req, res)=>{
    try{

    }catch(error){
        return res.status(500).send({status: false, message: error.message})
    }
}



module.exports = {AddtoCart, updateCartData, getCartData, deleteCartData}