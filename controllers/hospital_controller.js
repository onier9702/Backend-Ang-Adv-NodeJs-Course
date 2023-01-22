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

const updateHospital = async ( req, res = response ) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const userDB = await Hospital.findById(id);
        if ( !userDB ) {
            res.status(201).json({
                ok: false,
                msg: `Hospital with ID: ${id} not found`  
            })
        };
        const changesHospital = {
            ...req.body,
            user: uid
        };
        const updatedHospital = await Hospital.findByIdAndUpdate(id, changesHospital, { new: true });

        res.status(201).json({
            ok: true,
            hospital: updatedHospital,            
        })
        
    } catch (error) {
        handleErrosDB(error)
    }

};

const deleteHospital = async ( req, res = response ) => {

    const id = req.params.id;
    // const uid = req.uid;

    try {

        const hospitalDB = await Hospital.findById(id);
        if ( !hospitalDB ) {
            res.status(201).json({
                ok: false,
                msg: `Hospital with ID: ${id} not found`  
            })
        };

        await Hospital.findByIdAndDelete(id);

        res.status(201).json({
            ok: true,
            msg: 'Deleted successfully'          
        })
        
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