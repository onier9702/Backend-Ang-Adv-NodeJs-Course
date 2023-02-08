const { request, response } = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/generateJWT');
const { menuFrontend } = require('../helpers/menu-frontend');

const getUser = async ( req = request, res ) => {

    try {

        // pagination
        const { since = 0, limit = 20 } = req.query;
        
        // const users = await User.find({}, 'name'); // some field

        const [ count, users ] = await Promise.all([
            User.countDocuments(),
            User.find({}, 'name email img role google isActive age')
                                .skip( since )
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
            token,
            menu: menuFrontend( userSaved.role )
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
        let error;
        if ( email && (email != userFromDB.email) ) {
            const existEmail = await User.findOne( {email} );
            if ( existEmail ) {
                error = `The email: ${email} already was taken`;
            }
            // just user logged in with no google can update their emails
            if ( !userFromDB.google ) {
                restUser.email = email;
            } else if ( email !== userFromDB.email ) {
                error = `Google users can not change their emails`;
            }
            
        }

        if (error) {
            return res.status(400).json({
                ok: false,
                msg: error
            })
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
        await User.findByIdAndUpdate(uid, { isActive: false });

        res.status(202).json({
            ok: true,
            msg: 'User removed'
        })
        
    } catch (error) {
        handleErrosOnDB(error);
    }

};

const learningAggregateMongoDB = async (req, res = response) => {

    try {

        // ---------  Start Youtube Course   ---------------

        // const result = await User.aggregate([
        //     { $match: { role: "ADMIN_ROLE" } },
        //     { $group: { _id: { name: "$name", correo: "$email" } } },
        // ]);

        // const result = await User.aggregate([
        //     { $match: { name: {$nin: ["Reino", "Onier"] } } },
        //     { $group: { _id: { name: "$name", correo: "$email", state: "$isActive" } } },
        // ]);

        // const result = await User.aggregate([
        //     { $match: { age: {$lte: 25 } } },
        //     { $group: { _id: { name: "$name", correo: "$email", age: "$age" } } },
        // ]);

        // const result = await User.aggregate([
        //     { $project: { age: 1, name: 1, correo: "$email" } },
        // ]);

        // const result = await User.aggregate([
        //     { $project: { _id: 0, age: 1, name: 1, correo: "$email" } },
        // ]);

        // const result = await User.aggregate([
        //     { $project: { _id: 0, age: 0, name: 0 } },
        // ]);

        // const result = await User.aggregate([
        //     { $match: { age: {$gt: 30} }},
        //     { $project: { _id: 0, email: 1, name: 1, age: 1 } },
        // ]);
        // const result = await User.aggregate([
        //     { $project: { _id: 0,
        //         name: 1,
        //         info: {
        //             edad: "$age",
        //             correo: "$email"
        //         } } },
        // ]);
        // const result = await User.aggregate([
        //     { $unwind: "$role"}, // unwind return one object for each property that arra have
        //     // if array role have 3 values then unwind bring 3 object ant that field as a string 
        //     { $project: { _id: 0, email: 1, name: 1, age: 1, role: 1 } },
        // ]);
        // const result = await User.aggregate([
        //     // { $unwind: "$role"}, 
        //     { $group: { _id: "$role" } }, // return two objects: one [User_Role] and other [ADMIN_ROLE,User_ROLE]
        // ]);
        // const result = await User.aggregate([
        //     { $unwind: "$role"},  // return two objects: one [User_Role] and other [ADMIN_ROLE] separated
        //     { $group: { _id: "$role" } },
        // ]);

        // Accumulators, most are used on group stage
        // const result = await User.aggregate([
        //     { $unwind: "$role"},  // return two objects: one [User_Role] and other [ADMIN_ROLE] separated
        //     { $group: { _id: "$role" } },
        // ]);

        // // Average acummulator( acumulate average count of a group)
        // const result = await User.aggregate([
        //     { $group: { _id: "$role", avgAge: { $avg: "$age" } } },
        // ]);

        // Sum acummulator( acummulate total count of a group )
        // const result = await User.aggregate([
        //     { $group: { _id: "$age", existsWithThatAge: { $sum: 1 } } },
        // ]);

        // Unary Operators ( work for each document of a group and not of total group as acummulator did )
        // $type $lt $gt $or $and $multiply
        // const result = await User.aggregate([
        //     { $project: { 
        //         _id: 0,
        //         name: 1, 
        //         ageType: { $type: "$age" },
        //         emailType: { $type: "$email" }, 
        //         isActiveType: { $type: "$isActive" },
        //         roleType: { $type: "$role" }
        //     } },
        // ]);

        // Out operator will create a new collectio of the result, for that reason it should be written at the end of code
        // const result = await User.aggregate([
        //     { $project: { 
        //         _id: 0,
        //         name: 1, 
        //         ageType: { $type: "$age" },
        //         emailType: { $type: "$email" }, 
        //         isActiveType: { $type: "$isActive" },
        //         roleType: { $type: "$role" }
        //     } },
        //     { $out: "newCollectionNameHere" } // this will create a new collection on DB with name: newCollectionNameHere
        // ]);

        // allowDiskUse property
        // const result = await User.aggregate([
        //     { $project: { 
        //         _id: 0,
        //         name: 1, 
        //         ageType: { $type: "$age" },
        //     } },
        // ], { allowDiskUse: true}); // this tell server that can use temporary file instead of RAM

        // /this count all different values isActive field has ( in this case true or false)
        // const result = await User.aggregate([
        //     { $group: { _id: "$isActive" } },
        //     { $count: "total-isActive-Field" },
        // ]);

        // /this count all different values google field has ( in this case only false)
        // /because no user has google in true by the moment
        // const result = await User.aggregate([
        //     { $group: { _id: "$google" } },
        //     { $count: "total-google-Field" },
        // ]);

        // /this count all different values name and email field has
        // const result = await User.aggregate([
        //     { $group: { _id: { name: "$name", email: "$email"} } },
        //     { $count: "total-nameAndEmail-Field" },
        // ]);
        // const result = await User.aggregate([
        //     { $group: { _id: { active: "$isActive" } } },
        //     // { $count: "total" },
        // ]);

        // ---------------   END youtube course  -------------------

        // using first operator of a result
        const result = await User.aggregate([
            { $sort: { 
                    age: 1, 
                    role: 1
                    // state: 0, // in case document contains field state
                    // date: 1 // in case date exists
                }
            },
            {
            $group:
                {
                // _id: "$state",
                _id: "$role",
                firstAge: { $first: "$age" }
                // firstAge: { $first: "$date" }
                }
            }
        ]);



        res.status(200).json({
            ok: true,
            count: result.length,
            result
        })
        
    } catch (error) {
        handleErrosOnDB(error);
    }

}

const handleErrosOnDB = ( err ) => {

    console.log(err);
    return res.status(500).json({
        ok: false,
        msg: 'Check logs, Internal Server Error'
    })

}


module.exports =  {
    getUser,
    createUser,
    updateUser,
    deleteUser,
    learningAggregateMongoDB
}