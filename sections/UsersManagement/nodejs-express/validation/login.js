const Validator = require('validator');
const isEmpty = require('is-empty');

const validateLogin = (data) => {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    if(Validator.isEmpty(data.email)) {
        errors.message = "Email is required";
    }

    if(Validator.isEmpty(data.password)) {
        errors.message = "Email is required";
    }

    return {
        errors,
        validData: isEmpty(errors)
    }
};

module.exports = validateLogin;