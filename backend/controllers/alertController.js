const Alert = require("../models/Alert");

exports.createAlert = async (req, res) => {
  try {

    const { userId, msg, latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Location coordinates missing"
      });
    }

    const alert = await Alert.create({
      userId,
      msg,
      latitude,
      longitude,
      ts: new Date()
    });

    res.json({
      success: true,
      alert
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAlerts = async (req, res) => {
  try {

    const alerts = await Alert.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      alerts
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAlert = async (req, res) => {
  try {

    await Alert.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Alert deleted"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};