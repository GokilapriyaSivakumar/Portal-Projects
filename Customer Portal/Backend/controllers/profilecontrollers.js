const profileService = require("../services/profileservices");

const getProfile = async (req, res) => {
  try {
    const customerNumber = req.query.kunnr || "0000000001"; // default if no query
    const profile = await profileService.getCustomerProfile(customerNumber);
    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch customer profile" });
  }
};

module.exports = { getProfile };
