const { Router } = require("express");
const { check } = require("express-validator");

const { getUser, createUser, updateUser, deleteUser } = require('../controllers/user_controller');

const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validateJWT");

const router = Router();

/* 

    Route: 'api/users'
*/

// private
router.get('/', 
    [
        validateJWT
    ],
    getUser
);

// public
router.post('/', 
    [
        check('name', 'Name is obligated').not().isEmpty(),
        check('email').isEmail(),
        check('password').not().isEmpty(),
        validateFields
    ], 
    createUser
);

// private
router.put('/:id', 
    [
        validateJWT
    ], 
    updateUser
);

// private
router.delete('/:id', 
    [
        validateJWT
    ],
    deleteUser 
)



module.exports = router;
