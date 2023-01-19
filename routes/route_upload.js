

const { Router } = require("express");
const { uploadFile, getImageFile } = require("../controllers/upload_controller");
const expressFileUpload = require('express-fileupload');
const { validateJWT } = require("../middlewares/validateJWT");

/* 

    Route: 'api/upload'
*/

const router = Router();

router.use( expressFileUpload() );
// private
router.put('/:type/:id',
    [
        validateJWT
    ],
    uploadFile
)

router.get('/:type/:photo', getImageFile )


module.exports = router;