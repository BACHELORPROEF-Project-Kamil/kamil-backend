const express = require("express");
const router = express.Router();
const { checkDomainAge } = require("../utils/dnsChecker");
const User = require("../models/User");

router.post("/", async (req, res) => {
	try {
		const { url, uid } = req.body;

		if (!url) {
			return res.status(400).json({ status: "error", message: "No URL provided" });
		}

		let findings = [];
		let status = "good";

		const ageResult = await checkDomainAge(url);

		if (ageResult.isTooYoung) {
			status = "warning";
			findings.push({
				type: "NEW_DOMAIN",
				message: `Deze website is erg nieuw (pas ${ageResult.ageInDays} dagen oud). Wees extra voorzichtig.`,
				link: "#", // Later link plaatsen naar Kamil blog over nieuwe domeinen
			});
		}

		const hasPunycode = url.includes("xn--") || /[^\x00-\x7F]/.test(url);

		if (hasPunycode) {
			status = "warning";
			findings.push({
				type: "PUNYCODE_DETECTED",
				message: "De URL bevat speciale tekens die lijken op de normale letters, Dit wordt vaak gebruikt voor phishing.",
				link: "#", // Later link plaatsen naar Kamil blog over punycode
			});
		}

		let userStats = null;
		if (uid) {
			const isWarning = status !== "good";
			userStats = await User.findOneAndUpdate(
				{ uid: uid },
				{
					$inc: {
						total_checks: 1,
						phishing_warnings: isWarning ? 1 : 0,
					},
					$set: {
						last_active: new Date(),
					},
				},
				{ upsert: true, new: true },
			);
		}

		res.json({
			status: findings.length > 0 ? status : "good",
			findings: findings,

			user_stats: userStats
				? {
						total_checks: userStats.total_checks,
						phishing_warnings: userStats.phishing_warnings,
					}
				: null,
		});
	} catch (err) {
		console.error("Error in checkRoutes:", err);
		res.status(500).json({ status: "error", message: "Internal server error" });
	}
});

module.exports = router;
