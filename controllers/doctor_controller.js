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

const updateDoctor = async ( req, res = response ) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const doctorDB = await Doctor.findById(id);
        if ( !doctorDB ) {
            res.status(201).json({
                ok: false,
                msg: `Doctor with ID: ${id} not found`  
            })
        };
        const changesDoctor = {
            ...req.body,
            user: uid
        };
        const updatedDoctor = await Doctor.findByIdAndUpdate(id, changesDoctor, { new: true });

        res.status(201).json({
            ok: true,
            doctor: updatedDoctor,            
        })
        
    } catch (error) {
        handleErrosDB(error)
    }

};

const deleteDoctor = async ( req, res = response ) => {

    const id = req.params.id;
    // const uid = req.uid;

    try {

        const doctorDB = await Doctor.findById(id);
        if ( !doctorDB ) {
            res.status(201).json({
                ok: false,
                msg: `Doctor with ID: ${id} not found`  
            })
        };

        await Doctor.findByIdAndDelete(id);

        res.status(201).json({
            ok: true,
            msg: 'Deleted successfully'          
        })
        
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