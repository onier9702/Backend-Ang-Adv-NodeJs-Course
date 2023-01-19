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
        check('email', 'Email is required').not().isEmpty(),
        check('email', 'Email format is incorrect').isEmail(),
        check('password', 'Password is required').not().isEmpty(),
        validateFields
    ],
    updateDoctor
)

// private
router.delete('/:id',
    [
        check('email', 'Email is required').not().isEmpty(),
        check('email', 'Email format is incorrect').isEmail(),
        check('password', 'Password is required').not().isEmpty(),
        validateFields
    ],
    deleteDoctor
    
)


module.exports = router;