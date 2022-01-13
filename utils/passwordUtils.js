const crypto = require('crypto');

const generatePassword = (password) => {
    var salt = crypto.randomBytes(32).toString('hex');
    var encryptedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
    return {
        salt : salt,
        encry_password : encryptedPassword,
    }
}

const validatePassword = (password,encry_password,salt) => {
    let passwordVerify = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
    return encry_password === passwordVerify;
};

module.exports = {
    generatePassword,
    validatePassword
}