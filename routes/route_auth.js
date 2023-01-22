const { Router } = require("express");
const { check } = require("express-validator");
const { Login, LoginGoogle, RevalidateToken } = require("../controllers/auth_controller");
const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validateJWT");

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
);

router.get('/renew', validateJWT, RevalidateToken );

router.post('/google',
    [
        check('token', 'Token Google is required').not().isEmpty(),
        validateFields
    ],
    LoginGoogle
)


module.exports = router;