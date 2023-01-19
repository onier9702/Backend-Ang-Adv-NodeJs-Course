
const { Router } = require("express");
const { searchAll, searchByCollection } = require("../controllers/search_controller");

const { validateJWT } = require("../middlewares/validateJWT");

/* 

    Route: 'api/all'
*/

const router = Router();

// private
router.get('/:terminus',
    [
        validateJWT
    ],
    searchAll
)

// private
router.get('/:type/:terminus',
    [
        validateJWT
    ],
    searchByCollection
)


module.exports = router;