const express = require("express");
const router = express.Router();
const { checkDomainAge } = require("../utils/dnsChecker");

router.post("/", async (req, res) => {
    try {
        const { url } = req.body;

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

        res.json({
            status: findings.length > 0 ? status : "good",
            findings: findings,
        });
        
    } catch (err) {
        console.error("Error in checkRoutes:", err);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
});

module.exports = router;