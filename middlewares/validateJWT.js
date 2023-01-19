const { response } = require("express");
const jwt = require('jsonwebtoken');


const validateJWT = (req, res = response, next) => {

    // read tokens from headers
    const token = req.header('x-token');

    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'There is no token in petition'
        })
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRET_KEY_JWT);
        req.uid = uid;
        next();
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token not valid'
        })
    }

};


module.exports = {
    validateJWT,
}