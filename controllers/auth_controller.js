const { response } = require("express");
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require("../helpers/generateJWT");
const verifyGoogle = require("../helpers/google-verify");


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
                msg: `Those credentials do not exist`
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

const LoginGoogle = async (req, res=response) => {

    const tokenGoogle = req.body.token;

    const { name, email, picture } = await verifyGoogle(tokenGoogle);

    let user;
    
    try {

        const userDB = await User.find({email});
        if ( !userDB ) {
            user = new User({
                name,
                email,
                password: '@@@', // user is registering with google and not with normal login
                img: picture,
                google: true
            })
        } else {
            user = userDB;
            user.google = true; // user have both authentication
        }
    
        // generate JWT
        const token = await generateJWT(userDB._id);
    
        // save user
        await user.save();

        res.json({
            ok: true,
            user,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Google Token not valid',
        })
    }

};

const RevalidateToken = async (req, res=response) => {

    try {

        const uid = req.uid;

        // generate new jwt
        const token = await generateJWT( uid );

        const user = await User.findById(uid);
        
        res.status(200).json({
            ok: true,
            user,
            token
        })

    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token has expired or is invalid'
        })
    }

}




module.exports = {
    Login,
    LoginGoogle,
    RevalidateToken
}