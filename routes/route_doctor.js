const { Router } = require("express");
const { check } = require("express-validator");
const { deleteDoctor, updateDoctor, createDoctor, getDoctors } = require("../controllers/doctor_controller");

const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validateJWT");

/* 

    Route: 'api/doctors'
*/

const router = Router();

// public
router.get('/', 
    [
        validateJWT
    ],
    getDoctors
)

// private
router.post('/',
    [
        validateJWT,
        check('name', 'Doctor name is required').not().isEmpty(),
        check('hospital', 'Hospital id is not correct').isMongoId(),
        validateFields
    ],
    createDoctor
)

// private
router.put('/:id',
    [
        validateJWT,
        check('name', 'Name is required').not().isEmpty(),
        check('hospital', 'Hospital should be a Mongo Id').isMongoId(),
        validateFields
    ],
    updateDoctor
)

// private
router.delete('/:id', validateJWT, deleteDoctor)


module.exports = router;