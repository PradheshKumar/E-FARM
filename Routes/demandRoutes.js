const express = require("express");
const demandController = require("../Controllers/demandController");

const router = express.Router();

router.post("/newDemand", demandController.newDemand);

module.exports = router;
