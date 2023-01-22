const { Router } = require("express");
const { check } = require("express-validator");
const { 
    deleteHospital, 
    updateHospital, 
    createHospital, 
    getHospitals 
} = require("../controllers/hospital_controller");

const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validateJWT");

/* 

    Route: 'api/hospital'
*/

const router = Router();

// private
router.get('/', 
    [
        validateJWT
    ],
    getHospitals
)

// private
router.post('/',
    [
        validateJWT,
        check('name', 'Hospital Name is required').not().isEmpty(),
        validateFields
    ],
    createHospital
)

// private
router.put('/:id',
    [
        check('name', 'Name is required').not().isEmpty(),
        validateFields
    ],
    updateHospital
)

// private
router.delete('/:id', validateJWT, deleteHospital )


module.exports = router;