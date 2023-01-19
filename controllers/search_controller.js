const { request, response } = require("express");
const User = require('../models/user');
const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');

const searchAll = async (req = request, res = response) => {

    const terminus = req.params.terminus;

    try {

        const regex = RegExp(terminus, 'i'); // 'i': means insensitive

        const resultPromises = await Promise.all([
            User.find({ name: regex }),
            Hospital.find({ name: regex }),
            Doctor.find({ name: regex }),
        ]);

        const result = resultPromises.filter( res => res.length); // return only who is not empty array[] 

        res.status(200).json({
            ok: true,
            result
        })
        
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'Contact Admin, search failed, check logs'
        })
    }

};

const searchByCollection = async (req = request, res = response) => {

    const { type, terminus } = req.params;

    try {

        const regex = RegExp(terminus, 'i'); // 'i': means insensitive

        let data = [];

        switch (type) {
            case 'user':
                data = await User.find({ name: regex });
                break;

            case 'hospital':
                data = await Hospital.find({ name: regex });
                break;

            case 'doctor':
                data = await Doctor.find({ name: regex });
                break;
        
            default:
                return res.status(400).json({
                    ok: false,
                    msg: 'Just exists these collection: [doctor, hospital, user]'
                })
            
        }

        res.status(200).json({
            ok: true,
            result: data
        });
        
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'Contact Admin, search failed, check logs'
        })
    }

};


module.exports = {
    searchAll,
    searchByCollection
}