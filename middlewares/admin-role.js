const { response } = require("express");
const User = require('../models/user');

const adminRole = async(req, res = response, next) => {

    
    const uid = req.uid;

    try {

        const userDB = await User.findById(uid);
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                msg: 'User not found'
            })
        }

        if ( userDB.role !== 'ADMIN_ROLE' ) {
            return res.status(403).json({
                ok: false,
                msg: 'You do not have that privilege'
            })
        }

        next();
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Contact Admin please, an error has ocured'
        })
    }

};

module.exports = {
    adminRole
}