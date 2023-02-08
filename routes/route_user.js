const { Router } = require("express");
const { check } = require("express-validator");

const { getUser, createUser, updateUser, deleteUser, learningAggregateMongoDB } = require('../controllers/user_controller');
const { adminRole } = require("../middlewares/admin-role");
const { checkMyself } = require("../middlewares/check-myself");

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

// private
router.get('/queries/aggregate', [], learningAggregateMongoDB
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
        validateJWT,
        check('name', 'Name is obligated').not().isEmpty(),
        checkMyself,
        validateFields
    ], 
    updateUser
);

// private
router.delete('/:id', 
    [
        validateJWT, adminRole
    ],
    deleteUser 
)



module.exports = router;
