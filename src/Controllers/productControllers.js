const isValidUserData = require('../DataValidation/dataValidationModules');
const { createProducts, updateProduct } = require("../DataValidation/dataValidation")
const productModel = require("../Models/productModel");
const mongoose = require('mongoose')
const { uploadFile } = require("../Sdb_connection/aws");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
require('dotenv').config();


//===============================> (Product data create by post api) <===========================================//

const createProduct = async (req, res) => {
    try {
        // using destructuring of body data.  
        let data = req.body
        const { title, description, price, currencyId, currencyFormat,
            isFreeShipping, style, availableSizes, installments } = data;
        const files = req.files;

        //Input data validation
        let msgUserData = createProducts(data, files)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }

        const isTitleUnique = await productModel.findOne({ title });
        if (isTitleUnique) {
            return res.status(400).send({ status: false, message: `title: ${title} already exist` });
        }

        // Files data to url convert
        let uploadedFileURL = await uploadFile(files[0])

        //Create User data after format 
        const UserData = {
            title: title, description: description, price: price,
            currencyId: currencyId, currencyFormat: currencyFormat,
            isFreeShipping: isFreeShipping, productImage: uploadedFileURL, style: style,
            availableSizes: availableSizes, installments: installments
        };

        const createProduct = await productModel.create(UserData);
        return res.status(201).send({ status: true, message: "Product created successfully", data: createProduct })


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



//===============================> (Product data get by get api) <===========================================//

const getProductData = async (req, res) => {
    try {
        let data = await productModel.find({ isDeleted: false })
        return res.status(200).send({ status: true, message: "products get successfully", data: data })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



//===============================> (Product data get(by product id) by get api) <=============================//

const getProductById = async (req, res) => {
    try {
        let ProductId = req.params.productId

        if (!ProductId) {
            return res.status(400).send({ status: false, message: "Product Id not preasent" })
        }

        if (mongoose.Types.ObjectId.isValid(ProductId) == false) {
            return res.status(400).send({ status: false, message: "Product Id is not valid" });
        }

        let data = await productModel.findOne({ isDeleted: false, _id: ProductId })
        if (!data) {
            return res.status(404).send({ status: false, message: "Data not found." })
        }

        return res.status(200).send({ status: true, message: "product get successfully", data: data })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



//===============================> (Product data update by put api) <===========================================//

const updateProductById = async (req, res) => {
    try {
        let ProductId = req.params.productId;

        // using destructuring of body data.  
        let data = req.body
        const { title, description, price, currencyId, currencyFormat,
            isFreeShipping, style, availableSizes, installments } = data;
        const files = req.files;

        if (!ProductId) {
            return res.status(400).send({ status: false, message: "Product Id not preasent" })
        }

        if (mongoose.Types.ObjectId.isValid(ProductId) == false) {
            return res.status(400).send({ status: false, message: "Product Id is not valid" });
        }

        let product = await productModel.findOne({ isDeleted: false, _id: ProductId })
        if (!product) {
            return res.status(404).send({ status: false, message: "Data not found." })
        }

        //Input data validation
        let msgUserData = updateProduct(data, files)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }

        if (title) {
            const isTitleUnique = await productModel.findOne({ title: title, isDeleted: false});
            if (isTitleUnique) {
                return res.status(400).send({ status: false, message: `title: ${title} already exist` });
            }
        }

        // Files data to url convert
        if(files.length > 0){
            let uploadedFileURL = await uploadFile(files[0])
            data.productImage = uploadedFileURL;
        }

        await productModel.findOneAndUpdate({_id: ProductId, isDeleted: false}, data, {new: true});
        return res.status(201).send({ status: true, message: "Product update successfully"})

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



//===============================> (Product data delete by delete api) <===========================================//

const deleteProduct = async (req, res) => {
    try {
        let ProductId = req.params.productId;

        if (!ProductId) {
            return res.status(400).send({ status: false, message: "Product Id not preasent" })
        }

        if (mongoose.Types.ObjectId.isValid(ProductId) == false) {
            return res.status(400).send({ status: false, message: "Product Id is not valid" });
        }

        let data = await productModel.findOne({ isDeleted: false, _id: ProductId })
        if (!data) {
            return res.status(404).send({ status: false, message: "Data not found." })
        }

        await productModel.findOneAndUpdate({ _id: ProductId },{$set: {isDeleted: true}}, {new: true})
        return res.status(200).send({ status: true, message: "product deleted successfully"})

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports = { createProduct, getProductData, getProductById, updateProductById, deleteProduct }