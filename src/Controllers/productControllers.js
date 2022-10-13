const isValidUserData = require('../DataValidation/dataValidationModules');
const { createProducts, updateProduct, testProduct } = require("../DataValidation/dataValidation")
const productModel = require("../Models/productModel");
const mongoose = require('mongoose')
const { uploadFile } = require("../Sdb_connection/aws");
require('dotenv').config();



//===============================> (Product data create by post api) <===========================================//

const createProduct = async (req, res) => {
    try {
        // using destructuring of body data.  
        let data = req.body
        data.availableSizes = JSON.parse(data.availableSizes)
        data.isFreeShipping = JSON.parse(data.isFreeShipping)
        data.price = parseFloat(data.price)
        data.installments = parseInt(data.installments)
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
        const ProductData = {
            title: title, description: description, price: price,
            currencyId: currencyId, currencyFormat: currencyFormat,
            isFreeShipping: isFreeShipping, productImage: uploadedFileURL, style: style,
            availableSizes: availableSizes, installments: installments
        };

        const createProduct = await productModel.create(ProductData);
        return res.status(201).send({ status: true, message: "Product created successfully", data: createProduct })


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



//===============================> (Product data get by get api) <===========================================//

const getProductData = async (req, res) => {
    try {
        let datas = req.query
        // using destructuring of body data.  
        const { priceLessThan,priceGreaterThan, availableSizes} = datas
        let FindData = {}
        let Price = {}

        let Pdata = testProduct(datas, FindData)

        let msgUserData = updateProduct(Pdata)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }

        if(availableSizes){
            FindData.availableSizes = availableSizes
        }

        if (priceGreaterThan) {
            datas.priceGreaterThan = parseFloat(datas.priceGreaterThan)
            Price.$gt = datas.priceGreaterThan;
            Pdata.price = Price
        }

        if (priceLessThan) {
            datas.priceLessThan = parseFloat(datas.priceLessThan)
            Price.$lt = datas.priceLessThan;
            Pdata.price = Price
        }
        FindData.isDeleted = false

        // return res.send(FindData)
        let data = await productModel.find(FindData).sort( { "price": -1 } )
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
        const { title, price } = data;
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
        let FindData = {}
        let Pdata = testProduct(data, FindData, product)
        if(price)  Pdata.price = parseFloat(price)

        // return res.send(Pdata)
        let msgUserData = updateProduct(Pdata, files)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }

        if (title) {
            const isTitleUnique = await productModel.findOne({ title: title, isDeleted: false });
            if (isTitleUnique) {
                return res.status(400).send({ status: false, message: `title: ${title} already exist` });
            }
        }

        // Files data to url convert
        if (files.length > 0) {
            let uploadedFileURL = await uploadFile(files[0])
            data.productImage = uploadedFileURL;
        }

        let updateData = await productModel.findOneAndUpdate({ _id: ProductId, isDeleted: false }, data, { new: true });
        return res.status(200).send({ status: true, message: "Product update successfully", data: updateData })

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

        await productModel.findOneAndUpdate({ _id: ProductId }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
        return res.status(200).send({ status: true, message: "product deleted successfully" })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports = { createProduct, getProductData, getProductById, updateProductById, deleteProduct }