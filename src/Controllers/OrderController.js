const isValidUserData = require('../DataValidation/dataValidationModules');
const orderModel = require("../Models/orderModel");
const {uploadFile} = require("../Sdb_connection/aws");
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
require('dotenv').config();



//===============================> (Cart data get by get api) <===========================================//

const createOrder = async (req, res)=>{
    try{

    }catch(error){
        return res.status(500).send({status: false, message: error.message})
    }
}



//===============================> (Cart data get by get api) <===========================================//

const updateOrder = async (req, res)=>{
    try{

    }catch(error){
        return res.status(500).send({status: false, message: error.message})
    }
}


module.exports = {createOrder, updateOrder }