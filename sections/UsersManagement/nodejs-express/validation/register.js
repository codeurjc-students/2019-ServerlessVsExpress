const Validator = require('validator');
const isEmpty = require('is-empty');

const validateRegister = (data) => {
    let errors = {};
    
    // If the data is empty, we need to transform it to a void string
    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password_repeat = !isEmpty(data.password_repeat) ? data.password_repeat : "";

    if(Validator.isEmpty(data.name)) {
        errors.message = "Name field is required";
    }

    if(Validator.isEmpty(data.email)) {
        errors.message = "Email is required";
    } else if(!Validator.isEmail(data.email)) {
        errors.message = "This email is invalid";
    }

    if(Validator.isEmpty(data.password)) {
        errors.message = "Password is required";
    } else if(data.password.length < 4) {
        errors.message = "Password must be at least 4 characters long";
    }

    if(Validator.isEmpty(data.password_repeat)) {
        errors.message = "You need to repeat the password";
    } else if(data.password !== data.password_repeat) {
        errors.message = "Password must match";
    }

    return {
        errors,
        validData: isEmpty(errors)
    }
};

module.exports = validateRegister;