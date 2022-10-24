const { isValidCart, testCartItems } = require('../DataValidation/dataValidation')
const cartModel = require("../Models/cartModel");
const mongoose = require('mongoose')
const productModel = require('../Models/productModel');
require('dotenv').config();


//===============================> (Product data Add to cart by post api) <===========================================//

const AddtoCart = async (req, res) => {
    try {
        let UserId = req.params.userId
        // using destructuring of body data.  
        let data = req.body;

        let CartId = await cartModel.findOne({ userId: UserId })
        let message = isValidCart(data, CartId)
        if (message) {
            return res.status(400).send({ status: false, message: message })
        }
        let Products = await productModel.findOne({ isDeleted: false, _id: data.productId })
        if (!Products) {
            return res.status(404).send({ status: false, message: "Product Data not found." })
        }

        const { productId, cartId, quantity } = data;
        let obj = {}
        if (!cartId) {
            if (CartId) return res.status(400).send({ status: false, message: "Cart is already created please enter cartid in body" })
            let Price = Products.price * quantity
            let Items = [{ productId: Products, quantity: quantity }]

            obj.userId = UserId
            obj.items = Items
            obj.totalPrice = Price
            obj.totalItems = 1


            const createCart = await cartModel.create(obj)
            // let createDatas = await cartModel.findOne({ userId: UserId }).populate({path: "items.productId", model: "Product"})
            return res.status(201).send({ status: true, message: "Cart created and product added successfully", data: createCart })
        }

        if (cartId) {

            let checkCartExist = await cartModel.findOne({ _id: cartId })
            if (!checkCartExist) return res.status(404).send({ status: false, message: "cart not found" })
            obj.userId = UserId

            let arr = checkCartExist.items
            for (let i = 0; i < arr.length; i++) {
                if (checkCartExist.items[i].productId == productId) {
                    // return res.status(400).send({ satus: false, message: "this product already added" })

                    obj.items = arr
                    let price = checkCartExist.totalPrice
                    obj.totalPrice = price + Products.price * quantity
                    let item = checkCartExist.totalItems
                    obj.totalItems = item + 1

                    let addProduct = await cartModel.findOneAndUpdate({ _id: cartId }, obj, { new: true })
                    // let createDatas = await cartModel.findOne({ userId: UserId }).populate({path: "items.productId", model: "Product"})
                    return res.status(200).send({ satus: true, message: "product added successfully", data: addProduct })

                }
            }
            let productItem = checkCartExist.items
            let obj1 = { productId: Products, quantity: quantity }
            productItem.push(obj1)
            obj.items = productItem

            let price = checkCartExist.totalPrice
            obj.totalPrice = price + Products.price * quantity
            let item = checkCartExist.totalItems
            obj.totalItems = item + 1

            let addProduct = await cartModel.findOneAndUpdate({ _id: cartId }, obj, { new: true })
            // let createDatas = await cartModel.findOne({ userId: UserId }).populate({path: "items.productId", model: "Product"})
            return res.status(200).send({ satus: true, message: "product added successfully", data: addProduct })
        }


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


//===============================> (Product data update by put api) <===========================================//

const updateCartData = async (req, res) => {
    try {
        let UserId = req.params.userId
        let data = req.body;
        const { removeProduct, productId, cartId } = data

        let cartData = await cartModel.findOne({ userId: UserId })

        if (!cartId === cartData._id.toString()) {
            return res.status(400).send({ status: false, message: "please enter valid card Id." })
        }

        let Products = await productModel.findOne({ isDeleted: false, _id: productId })
        if (!Products) {
            return res.status(404).send({ status: false, message: "Data not found." })
        }
        if (removeProduct === 0) {
            let RemData = cartData.items
            //Find index of specific object using findIndex method.    
            objIndex = RemData.findIndex((obj => obj.productId === Products.productId));
            let P_Data = RemData[objIndex]
            let Prices = Products.price * P_Data.quantity

            await cartModel.findOneAndUpdate({ userId: UserId }, { $pull: { 'items': P_Data }, $inc: { totalItems: -1, totalPrice: -Prices } }, { multi: true });
            let createData = await cartModel.findOne({ userId: UserId })
            return res.status(200).send({ satus: false, message: "Your cart is update successfully", data: createData })

        }

        if (removeProduct === 1) {

            let RemData = cartData.items
            //Find index of specific object using findIndex method.    
            objIndex = RemData.findIndex((obj => obj.productId.toString() === Products._id.toString()));
            if (objIndex == -1) return res.status(400).send({ status: false, message: "Product not exist in your cart" })
            let P_Data = RemData[objIndex]
            let Prices = Products.price * RemData[objIndex].quantity
            let RemData_q = RemData[objIndex].quantity - 1;

            if (RemData_q == 0) {
                await cartModel.findOneAndUpdate({ userId: UserId }, { $pull: { 'items': P_Data }, $inc: { totalItems: -1, totalPrice: -Prices } }, { multi: true });
                let createData = await cartModel.findOne({ userId: UserId })
                return res.status(200).send({ satus: false, message: "Your cart is update successfully", data: createData })

            }
            if (RemData_q > 0) {
                await cartModel.findOneAndUpdate({ userId: UserId }, { $set: { items: RemData, totalPrice: Prices } }, { multi: true });
                let createData = await cartModel.findOne({ userId: UserId })
                return res.status(200).send({ satus: false, message: "Your cart is update successfully", data: createData })
            }

        }

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



//===============================> (Cart data get by get api) <===========================================//

const getCartData = async (req, res) => {
    try {
        let UserId = req.params.userId

        let data = await cartModel.findOne({ userId: UserId })
        if (!data) {
            return res.status(404).send({ status: false, message: "pleace create a cart" })
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

        let data = await cartModel.findOne({ userId: UserId })
        if (!data) {
            return res.status(404).send({ status: false, message: "pleace create a cart" })
        }
        // return res.send({data: data.items.length})
        if (data.items.length > 0 && data.totalPrice > 0 && data.totalItems > 0) {
            return res.status(400).send({ status: false, message: "make sure your cart is null" })
        }

        await cartModel.findOneAndRemove({ userId: UserId })

        return res.status(204).send({ status: true, message: "Your cart is Deleted." })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports = { AddtoCart, updateCartData, getCartData, deleteCartData }