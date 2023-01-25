const { request, response } = require("express");
const { v4: uuidV4 } = require('uuid');
const fs = require('fs');
const { updateImg } = require("../helpers/updateFileImg");
const path = require("path");


const uploadFile = async (req = request, res = response) => {

    const { type, id } = req.params;
    const typesPermitted = [ 'doctor', 'user', 'hospital' ];
    if ( !typesPermitted.includes(type) ) {
        return res.status(400).json({
            ok: false,
            msg: `Just [ ${typesPermitted} ] are allowed`
        })
    };

    // validate one file come from Frotend
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No files were uploaded.'
        });
    }

    // Image Procedure
    const file = req.files.file; // extract file from request
    const cutName = file.name.split('.');
    const extension = cutName[cutName.length -1];

    const validExtensions = [ 'jpeg', 'png', 'jpg' ];
    if ( !validExtensions.includes(extension) ) {
        return res.status(400).json({
            ok: false,
            msg: `Just extensions [ ${validExtensions} ] are allowed`
        })
    };

    const nameFile = `${ uuidV4() }.${ extension }`;

    // path where file will be grab
    const path = `./uploads/${ type }/${ nameFile }`;

    // Use the mv() method to place the file somewhere on your server
    file.mv(path, async (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'An error ocurred moving file'
            });
        }

        await updateImg(type, id, nameFile);
        
    });

    res.status(200).json({
        ok: true,
        msg: 'File uploaded!',
        file: nameFile
    });

};

const getImageFile = ( req, res = response ) => {

    const { type, photo } = req.params;

    const pathImg = path.join( __dirname ,  `../uploads/${type}/${photo}` );

    // verify if image exists
    if (!fs.existsSync( pathImg ) ) {
        const pathNoImage = path.join( __dirname, `../uploads/no-image.png`);
        res.status(200).sendFile( pathNoImage );
    } else {
        res.status(200).sendFile( pathImg );
    }

};


module.exports = {
    uploadFile,
    getImageFile
}