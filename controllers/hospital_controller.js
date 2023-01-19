const { response } = require("express");
const Hospital = require('../models/hospital');


const getHospitals = async (req, res = response ) => {

    try {

        const hospitals = await Hospital.find({})
                                    .populate('user', 'name img');
        res.status(200).json({
            ok: true,
            hospitals
        })
        
    } catch (error) {
        handleErrosDB(error)
    }

}

const createHospital = async ( req, res = response ) => {

    const uid = req.uid;  // uid is printed inside request in token verification before
    const hospital = new Hospital( {
            user: uid,
            ...req.body
        } 
    );

    try {

        const hospitalSaved = await hospital.save(hospital);

        res.status(200).json({
            ok: true,
            hospital: hospitalSaved,
        })
        
    } catch (error) {
        handleErrosDB(error)
    }

};

const updateHospital = ( req, res = response ) => {

    try {


        
    } catch (error) {
        handleErrosDB(error)
    }

};

const deleteHospital = ( req, res = response ) => {

    try {


        
    } catch (error) {
        handleErrosDB(error)
    }

};

const handleErrosDB = (err, res = response) => {
    console.log(err);
    res.status(500).json({
        ok: false,
        msg: 'Contact Admin and check logs'
    })
}

module.exports = {
    createHospital,
    getHospitals,
    deleteHospital,
    updateHospital
}