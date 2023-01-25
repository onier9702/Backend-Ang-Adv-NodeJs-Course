const { request, response } = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/generateJWT');

const getUser = async ( req = request, res ) => {

    try {

        // pagination
        const { skip = 0, limit = 2 } = req.query;
        
        // const users = await User.find({}, 'name'); // some field

        const [ count, users ] = await Promise.all([
            User.countDocuments(),
            User.find({}, 'name email img role google')
                                .skip( skip )
                                .limit( limit )
        ]) 
        res.json({
            ok: true,
            count,
            users
        })

    } catch (error) {
        handleErrosOnDB(error);
    }

};

const createUser = async ( req, res = response) => {

    const { name, email, password } = req.body;

    try {
        
        const existEmail = await User.findOne( {email} );
        
        if ( existEmail ) {
            return res.status(400).json({
                ok: false,
                msg: `The email: ${email} already was taken`
            })
        }

        const user = new User( req.body );

        // encrypt password
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync( password, salt );

        const userSaved = await user.save();

        const token = await generateJWT(userSaved._id);

        res.json({
            ok: true,
            user: userSaved,
            token
        })


    } catch (error) {
        handleErrosOnDB(error);
    }
    
};

const updateUser = async ( req, res = response) => {

    const { email, password, google, ...restUser } = req.body;
    const uid = req.params.id;

    try {
        
        const userFromDB = await User.findById( uid );
        
        if ( !userFromDB ) {
            return res.status(400).json({
                ok: false,
                msg: `User with ID: ${uid} not found`
            })
        }

        // if user want to change email
        if ( email && (email != userFromDB.email) ) {
            const existEmail = await User.findOne( {email} );
            if ( existEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: `The email: ${email} already was taken`
                })
            }
            // just user logged in with no google can update their emails
            if ( !userFromDB.google ) {
                restUser.email = email;
            } else if ( email !== userFromDB.email ) {
                return res.status(400).json({
                    ok: false,
                    msg: `Google users can not change their emails`
                }) 
            }
            
        }
        
        // encrypt password
        if ( password ) {
            const salt = bcrypt.genSaltSync(10);
            restUser.password = bcrypt.hashSync( password, salt );
        }

        const userUpdated = await User.findByIdAndUpdate(uid, restUser, {new: true});

        res.json({
            ok: true,
            user: userUpdated
        })


    } catch (error) {
        handleErrosOnDB(error);
    }

};

const deleteUser = async (req, res = response) => {

    try {

        const uid = req.params.id;
        const userFromDB = await User.findById( uid );
        
        if ( !userFromDB ) {
            return res.status(404).json({
                ok: false,
                msg: `User with ID: ${uid} not found`
            })
        }
        await User.findByIdAndDelete(uid);

        res.status(202).json({
            ok: true,
            msg: 'User removed'
        })
        
    } catch (error) {
        handleErrosOnDB(error);
    }

};

const handleErrosOnDB = ( err ) => {

    console.log(err);
    throw new Error('Check logs, Internal Server Error');

}


module.exports =  {
    getUser,
    createUser,
    updateUser,
    deleteUser
}