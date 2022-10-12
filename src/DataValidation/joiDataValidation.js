const Joi = require('Joi');

//fname, lname, email,profileImage, phone, password, address

//User create validation

const isValideUser = Joi.object({
    fname: Joi.string().required().alphanum().min(3).max(15).trim(),
    lname: Joi.string().required().alphanum().min(3).max(15).trim(),
    email: Joi.string().email().required().pattern(new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}')).trim(),
    profileImage: Joi.array().items(Joi.object({
        originalname: Joi.string().required().pattern(new RegExp('^.*\.(jpg|JPG|gif|GIF)$'))
    })),
    phone: Joi.string().required().pattern(/^((0091)|(\+91)|0?)[6789]{1}\d{9}$/),
    password: Joi.string().required().min(8).max(15).trim()
        .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/)),

    address: Joi.object({
        shipping: Joi.object({
            street: Joi.string().required().min(3).max(25).trim().pattern(new RegExp('^[a-zA-Z0-9,. ]*$')),
            city: Joi.string().required().min(3).max(15).trim().pattern(new RegExp('^[a-zA-Z,. ]*$')),
            pincode: Joi.number().required().min(6).max(6)
        }),
        billing: Joi.object({
            street: Joi.string().required().min(3).max(25).trim().pattern(new RegExp('^[a-zA-Z0-9,. ]*$')),
            city: Joi.string().required().min(3).max(15).trim().pattern(new RegExp('^[a-zA-Z,. ]*$')),
            pincode: Joi.number().required().min(6).max(6)
        })
    })
})


//User login Validation

const isValidLoginData = Joi.object({
    email: Joi.string().email().required().trim(),
    password: Joi.string().required().min(8).max(15).trim()
    .pattern(new RegExp('^\S*$')).message({ "any.omly": "Password must not contain Whitespaces." })
    .pattern(new RegExp('^(?=.*[A-Z]).*$')).message({ "any.only": "Password must have at least one Uppercase Character." })
    .pattern(new RegExp('^(?=.*[a-z]).*$')).message({ "any.only": "Password must have at least one Lowercase Character." })
    .pattern(new RegExp('^(?=.*[0-9]).*$')).message({ "any.only": "Password must contain at least one Digit." })
    .pattern(new RegExp('^[!@#$%&*]{1,}')).message({ "any.only": "Password must contain at least one Special Symbol." }),


})


//User update validation

const isValideUpdateData = Joi.object({
    fname: Joi.string().alphanum().min(3).max(15).trim(),
    lname: Joi.string().alphanum().min(3).max(15).trim(),
    email: Joi.string().email().pattern(new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}')).trim(),
    profileImage: Joi.array().items(Joi.object({
        originalname: Joi.string().pattern(new RegExp('^.*\.(jpg|JPG|gif|GIF)$')).pattern(new RegExp('^\S*$'))
    })),
    phone: Joi.number().min(10).max(10),
    password: Joi.string().min(8).max(15).trim()
        .pattern(new RegExp('^\S*$')).message({ "string.pattern": "Password must not contain Whitespaces." })
        .pattern(new RegExp('^(?=.*[A-Z]).*$')).message({ "string.pattern": "Password must have at least one Uppercase Character." })
        .pattern(new RegExp('^(?=.*[a-z]).*$')).message({ "string.pattern": "Password must have at least one Lowercase Character." })
        .pattern(new RegExp('^(?=.*[0-9]).*$')).message({ "string.pattern": "Password must contain at least one Digit." })
        .pattern(new RegExp('^[!@#$%&*]{1,}')).message({ "string.pattern": "Password must contain at least one Special Symbol." }),

    address: Joi.object({
        shipping: Joi.object({
            street: Joi.string().min(3).max(25).trim().pattern(new RegExp('^[a-zA-Z0-9,. ]*$')),
            city: Joi.string().min(3).max(15).trim().pattern(new RegExp('^[a-zA-Z,. ]*$')),
            pincode: Joi.number().min(6).max(6),
        }),

        billing: Joi.object({
            street: Joi.string().min(3).max(25).trim().pattern(new RegExp('^[a-zA-Z0-9,. ]*$')),
            city: Joi.string().min(3).max(15).trim().pattern(new RegExp('^[a-zA-Z,. ]*$')),
            pincode: Joi.number().required().min(6).max(6)
        })
    })
})



module.exports = {isValideUser, isValidLoginData, isValideUpdateData}
