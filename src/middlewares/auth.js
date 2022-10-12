const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const userModel = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
require('dotenv').config();

//Authentication of user.

const authentication = async (req, res, next)=>{
    try {
        let headers = req.headers.authorization;

        //Token present or not
        if (!headers) {
            return res.status(400).send({ status: false, msg: "Please enter token number." })
        }
        //if any other key present in key
        const token = headers.split(" ")[1];
        // return res.send(token)

        //Verify sekret key
        jwt.verify(String(token), process.env.secretKey, (err, user) => {
            if (err) {
                res.status(401).send({ status: false, msg: "Invalid Token" })
            } else {
                if (user.exp < Date.now() / 1000){
                    return res.status(400).send({ status: false, message: "Token is Expired, Please relogin" });
                } 
                req.Id = user.userId;
                // return res.send(req.Id)
                next();
            }
        })

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }

}


//Authorization of user.

const authorization = async (req, res, next)=>{
    try{
        let Id = req.Id;
        let data = req.params.userId;
        if (!data) {
            return res.status(400).send({ status: false, msg: "Invalide params" })
        }
        if (mongoose.Types.ObjectId.isValid(data) == false) {
            return res.status(400).send({ status: false, message: "UserId is not valid" });
        }
    
        if (Id !== data) {
            return res.status(403).send({ status: false, message: `unauthorized access` });
        }
        const UserData = await userModel.findById(data)
        // return console.log(UserData)
        req.let = UserData
        next()

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}



module.exports = {authentication, authorization}

