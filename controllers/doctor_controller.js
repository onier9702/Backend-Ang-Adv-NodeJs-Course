const { response } = require("express");
const Doctor = require('../models/doctor');


const getDoctors = async (req, res = response ) => {

    try {

        const doctors = await Doctor.find({})
                                    .populate('user', 'name img')
                                    .populate('hospital', 'name img');

        res.status(200).json({
            ok: true,
            doctors
        })
        
    } catch (error) {
        handleErrosDB(error)
    }

}

const createDoctor = async ( req, res = response ) => {

    const uid = req.uid;  // uid is printed inside request in token verification before
    const doctor = new Doctor( {
            user: uid,
            ...req.body
        } 
    );

    try {

        const doctorSaved = await doctor.save(doctor);

        res.status(200).json({
            ok: true,
            doctor: doctorSaved,
        })
        
    } catch (error) {
        handleErrosDB(error)
    }

};

const updateDoctor = ( req, res = response ) => {

    try {


        
    } catch (error) {
        handleErrosDB(error)
    }

};

const deleteDoctor = ( req, res = response ) => {

    try {


        
    } catch (error) {
        handleErrosDB(error)
    }

};

const handleErrosDB = (err) => {
    console.log(err);
    throw new Error('Contact Admin and check logs');
}

module.exports = {
    createDoctor,
    getDoctors,
    updateDoctor,
    deleteDoctor
}