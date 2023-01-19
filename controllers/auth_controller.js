const { response } = require("express");
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require("../helpers/generateJWT");
const Login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const userDB = await User.findOne( {email} );
        if ( !userDB ) {
            return res.status(404).json({
                ok: false,
                msg: `User with those credentials does not exist`
            })
        }

        // verify if password match
        const validPass = bcrypt.compareSync(password, userDB.password);
        if ( !validPass ) {
            return res.status(404).json({
                ok: false,
                msg: `Those credentials are not exist`
            })
        }

        // generate JWT
        const token = await generateJWT(userDB._id);

        res.status(200).json({
            ok: true,
            user: userDB,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Contact Admin, check logs'
        })
    }

};




module.exports = {
    Login
}