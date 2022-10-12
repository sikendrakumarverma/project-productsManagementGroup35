const isValidUserData = require('./dataValidationModules');
// const { createProduct } = require('../DataValidation/dataValidation')
const mongoose = require('mongoose')

//User data validation

const isValideUser = (data, files) => {
    // using destructuring of body data.
    const { fname, lname, email, phone, password, address } = data;

    //Input data validation
    let msgUserData = isValidUserData.isValidRequest(data)
    if (msgUserData) return msgUserData

    let msgFnameData = isValidUserData.isValidName(fname)
    if (msgFnameData) return msgFnameData

    let msgLnameData = isValidUserData.isValidName(lname)
    if (msgLnameData) return msgLnameData

    let msgEmailData = isValidUserData.isValidEmail(email)
    if (msgEmailData) return msgEmailData

    let msgPhoneData = isValidUserData.isValidPhone(phone)
    if (msgPhoneData) return msgPhoneData

    let msgPassData = isValidUserData.isValidpass(password)
    if (msgPassData) return msgPassData

    let msgAddressData = isValidUserData.isValidAddress(address)
    if (msgAddressData) return msgAddressData

    let msgFileData = isValidUserData.isValidFile(files)
    if (msgFileData) return msgFileData
}

//User login data validation.

const isValidLoginData = (data) => {
    // using destructuring of body data.
    const { email, password } = data;

    //Input data validation
    let msgUserData = isValidUserData.isValidRequest(data)
    if (msgUserData) return msgUserData

    let msgEmailData = isValidUserData.isValidEmail(email)
    if (msgEmailData) return msgEmailData

    let msgPassData = isValidUserData.isValidpass(password)
    if (msgPassData) return msgPassData
}


//User profile update.

const isValideUpdateData = (data, Data) => {
    // using destructuring of body data.
    const { fname, lname, email, phone, password, address } = data;

    //Input data validation
    let msgUserData = isValidUserData.isValidRequest(data)
    if (msgUserData) {
        return res.status(400).send({ status: false, message: msgUserData })
    }

    if (fname) {
        let msgFnameData = isValidUserData.isValidName(fname)
        if (msgFnameData) {
            return res.status(400).send({ status: false, message: msgFnameData })
        }
    }

    if (lname) {
        let msgLnameData = isValidUserData.isValidName(lname)
        if (msgLnameData) {
            return res.status(400).send({ status: false, message: msgLnameData })
        }
    }

    if (email) {
        let msgEmailData = isValidUserData.isValidEmail(email)
        if (msgEmailData) return msgEmailData

        if (Data.email === email) return `email: ${email} already exist`;
    }

    if (phone) {
        let msgPhoneData = isValidUserData.isValidPhone(phone)
        if (msgPhoneData) return msgPhoneData

        if (Data.phone === phone) return `mobile number: ${phone} already exist`;
    }

    if (address) {
        data.address = JSON.parse(address)
        let msgAddressData = isValidUserData.isValidAdd(data.address)
        if (msgAddressData) return msgAddressData
    }
    
}

// {
//     "address": {
//         "shipping": {
//             "street": "Bijoy"
//         }
//     }
// }

const testAddress = (address, Address)=>{
        if (address.shipping) {
            if (address.shipping.street) {
                Address.address.shipping.street = address.shipping.street
            }

            if (address.shipping.city) {
                Address.address.shipping.city = address.shipping.city
            }

            if (address.shipping.pincode) {
                Address.address.shipping.pincode = address.shipping.pincode
            } 
        }
        if (address.billing) {
            if (address.billing.street) {
                Address.address.billing.street = address.billing.street
            } 

            if (address.billing.city) {
                Address.address.billing.city = address.billing.city
            } 

            if (address.billing.pincode) {
                Address.address.billing.pincode = address.billing.pincode
            }

        }
        return Address

    }


//==========================================> (Product api) <==================================================//



//Create product's

const createProducts = (data, files) => {
    // using destructuring of body data.                
    const { title, description, price, currencyId, currencyFormat,
        isFreeShipping, style, availableSizes, installments } = data;

    //Input data validation
    let msgUserData = isValidUserData.isValidRequest(data)
    if (msgUserData) return msgUserData

    let msgTitleData = isValidUserData.isValidData(title)
    if (msgTitleData) return msgTitleData

    let msgDesData = isValidUserData.isValidData(description)
    if (msgDesData) return msgDesData

    let msgPriceData = isValidUserData.isValidPrice(price)
    if (msgPriceData) return msgPriceData

    let msgcurrencyIdData = isValidUserData.isValidCurrencyId(currencyId)
    if (msgcurrencyIdData) return msgcurrencyIdData

    let msgCurrencyFormatData = isValidUserData.isValidCurrencyFormat(currencyFormat)
    if (msgCurrencyFormatData) return msgCurrencyFormatData

    let msgisFreeShippingData = isValidUserData.isValidFreeShipping(isFreeShipping)
    if (msgisFreeShippingData) return msgisFreeShippingData

    let msgFileData = isValidUserData.isValidFile(files)
    if (msgFileData) return msgFileData

    if (style) {
        let msgstyleData = isValidUserData.isValidstyle(style)
        if (msgstyleData) return msgstyleData
    }

    let msgavailableSizesData = isValidUserData.isValidavailableSizes(availableSizes)
    if (msgavailableSizesData) return msgavailableSizesData

    if (installments) {
        let msginstallmentsData = isValidUserData.isValidinstallments(installments)
        if (msginstallmentsData) return msginstallmentsData
    }
}


//Format product data.

const testProduct = (datas, FindData)=>{

    // using destructuring of body data.  
    const {title, description, isFreeShipping, style, 
        availableSizes, installments, currencyId, currencyFormat} = datas

    if(title){
        FindData.title = title
    }
    if(description){
        FindData.description = description
    }
    if(isFreeShipping){
        datas.isFreeShipping = JSON.parse(datas.isFreeShipping)
        FindData.isFreeShipping = datas.isFreeShipping
    }
    if(style){
        FindData.style = style
    }
    if(availableSizes){
        datas.availableSizes = [datas.availableSizes]
        FindData.availableSizes = datas.availableSizes
    }
    if(installments){
        datas.installments = parseInt(datas.installments)
        FindData.installments = datas.installments     
    }
    if(currencyId){
        FindData.currencyId = datas.currencyId    
    }
    if(currencyFormat){
        FindData.currencyFormat = datas.currencyFormat  
    }
    return FindData
}


//Update product

const updateProduct = (data, files) => {
    // using destructuring of body data.                
    const { title, description, price, currencyId, currencyFormat,
        isFreeShipping, style, availableSizes, installments } = data;

    //Input data validation
    let msgUserData = isValidUserData.isValidRequest(data)
    if (msgUserData) return msgUserData

    if (title) {
        let msgTitleData = isValidUserData.isValidData(title)
        if (msgTitleData) return msgTitleData
    }

    if (description) {
        let msgDesData = isValidUserData.isValidData(description)
        if (msgDesData) return msgDesData
    }

    if (price) {
        let msgPriceData = isValidUserData.isValidPrice(price)
        if (msgPriceData) return msgPriceData
    }

    if (currencyId) {
        let msgcurrencyIdData = isValidUserData.isValidCurrencyId(currencyId)
        if (msgcurrencyIdData) return msgcurrencyIdData
    }

    if (currencyFormat) {
        let msgCurrencyFormatData = isValidUserData.isValidCurrencyFormat(currencyFormat)
        if (msgCurrencyFormatData) return msgCurrencyFormatData
    }

    if (isFreeShipping) {
        let msgisFreeShippingData = isValidUserData.isValidFreeShipping(isFreeShipping)
        if (msgisFreeShippingData) return msgisFreeShippingData
    }

    if (files) {
        let msgFileData = isValidUserData.isValidFile(files)
        if (msgFileData) return msgFileData
    }

    if (style) {
        let msgstyleData = isValidUserData.isValidstyle(style)
        if (msgstyleData) return msgstyleData
    }

    if (availableSizes) {
        let msgavailableSizesData = isValidUserData.isValidavailableSizes(availableSizes)
        if (msgavailableSizesData) return msgavailableSizesData
    }

    if (installments) {
        let msginstallmentsData = isValidUserData.isValidinstallments(installments)
        if (msginstallmentsData) return msginstallmentsData
    }
}


//Create new cart.

const isValidCart = (data, UserId) => {
    // using destructuring of body data.  
    const { userId, items, totalPrice, totalItems } = data;
    const { productId, quantity } = items[0]

    if(UserId != userId) return "Params and from user Id not match"

    if (!userId) return  "User Id not preasent" ;

    if (mongoose.Types.ObjectId.isValid(userId) == false) return  "User Id is not valid" ;

    if (!productId)  return "Product Id not preasent"

    if (mongoose.Types.ObjectId.isValid(productId) == false) return "Product Id is not valid"

    // let msgTotalPriceData = isValidUserData.isValidPrice(totalPrice)
    // if (msgTotalPriceData) return msgTotalPriceData

    // let msgTotalItemsData = isValidUserData.isValidPrice(totalItems)
    // if (msgTotalItemsData ) return msgTotalItemsData 

    let msgTotalQuantityData = isValidUserData.isValidPrice(quantity )
    if (msgTotalQuantityData) return msgTotalQuantityData

}






module.exports = {
    isValideUser, isValidLoginData, isValideUpdateData,testAddress,
    createProducts, testProduct, updateProduct, isValidCart
}