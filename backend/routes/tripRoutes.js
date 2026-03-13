const router = require("express").Router();
const {
  createTrip,
  getTrips,
  deleteTrip
} = require("../controllers/tripController");

router.post("/", createTrip);
router.get("/", getTrips);
router.delete("/:id", deleteTrip);

module.exports = router;