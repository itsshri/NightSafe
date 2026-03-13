const Trip = require("../models/Trip");


// CREATE TRIP
exports.createTrip = async (req, res) => {
  try {

    const { cabId, verified } = req.body;

    const trip = await Trip.create({
      cabId,
      verified,
      startTime: new Date()
    });

    res.json({
      success: true,
      trip
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET ALL TRIPS
exports.getTrips = async (req, res) => {
  try {

    const trips = await Trip.find().sort({ createdAt: -1 });

    const formatted = trips.map(t => ({
      tripKey: t._id,
      cabId: t.cabId,
      verified: t.verified,
      startTime: t.startTime
    }));

    res.json({
      success: true,
      trips: formatted
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// DELETE TRIP
exports.deleteTrip = async (req, res) => {
  try {

    await Trip.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Trip deleted"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};