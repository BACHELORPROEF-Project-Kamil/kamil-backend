const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/global-stats", async (req, res) => {
	try {
		const stats = await User.aggregate([
			{
				$group: {
					_id: null,
					total_checks: { $sum: "$total_checks" },
					total_warnings: { $sum: "$phishing_warnings" },
					total_users: { $sum: 1 },
				},
			},
		]);

		res.json({
			status: "success",
			data: stats[0] || { total_checks: 0, total_warnings: 0, total_users: 0 },
		});
	} catch (error) {
		console.error("Error in statsRoutes:", error);
		res.status(500).json({ status: "error", message: error.message });
	}
});

module.exports = router;