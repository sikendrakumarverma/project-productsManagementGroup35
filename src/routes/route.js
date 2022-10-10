const express = require('express');
const router = express.Router();


//--------------------------> (This is test api ) <-------------------------------------//

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})


//================================( All api)====================================//





// router.all("/**",  (req, res) => {
//     return res.status(400).send({ status: false, msg: "Invalid api." })
// });



module.exports = router;
