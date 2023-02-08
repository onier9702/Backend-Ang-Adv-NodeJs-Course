const { response } = require("express");
const User = require('../models/user');

const checkMyself = async(req, res = response, next) => {

    
    const uid = req.uid;
    const id = req.params.id;

    try {


        const userDB = await User.findById(uid);
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                msg: 'User not found'
            })
        }

        if ( uid !== id && userDB.role !== 'ADMIN_ROLE' ) {
            return res.status(403).json({
                ok: false,
                msg: 'You can not do that, it belongs to other owner'
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
    checkMyself
}