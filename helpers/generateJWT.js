const jwt = require('jsonwebtoken');

const generateJWT = (uid) => {

    return new Promise( (resolve, reject) => {

        const payload = {
            uid,
        }
    
        jwt.sign( payload, process.env.SECRET_KEY_JWT, {
            expiresIn: '4h'
        }, (err, token) => {
            if ( err ) {
                console.log(err);
                reject(err);
            } else {
                resolve(token);
            }

        } );

    } )

};

module.exports = {
    generateJWT,
};