const { Router } = require("express");
const { check } = require("express-validator");
const { Login } = require("../controllers/auth_controller");
const { validateFields } = require("../middlewares/validate-fields");

/* 

    Route: 'api/login'
*/

const router = Router();

// public
router.post('/',
    [
        check('email', 'Email is required').not().isEmpty(),
        check('email', 'Email format is incorrect').isEmail(),
        check('password', 'Password is required').not().isEmpty(),
        validateFields
    ],
    Login
)


module.exports = router;