const fs = require('fs');
const User = require('../models/user');
const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');

const updateImg = async( type, id, nameFile ) => {

    try {

        switch (type) {
            case 'doctor':
                const doctor = await Doctor.findById(id);
                await processImage( 'doctor', doctor, nameFile );
                break;

            case 'user':
                const user = await User.findById(id);
                await processImage( 'user', user, nameFile );
                break;

            case 'hospital':
                const hospital = await Hospital.findById(id);
                await processImage( 'hospital', hospital, nameFile );
                break

            default:
                return res.status(400).json({
                    ok: false,
                    msg: 'Just exists these collection: [doctor, hospital, user]'
                })
            
        }

        
    } catch (error) {
        console.log(error);
        throw new Error('Something wrong updating image, check logs');
    }

};

const processImage = async( type, data, nameFile ) => {

    if ( !data ) {
        return false;
    }
    const oldPath = `./uploads/${type}/${ data.img }`;
    if ( fs.existsSync( oldPath ) ) {
        // remove image
        fs.unlinkSync(oldPath);
    }

    data.img = nameFile;
    await data.save();

    return true;

};


module.exports = {
    updateImg,
}