const axios = require("axios");

const checkDomainAge = async (url) => {
	try {
		const domain = new URL(url).hostname;
		const apiKey = process.env.WHOIS_JSON_API_KEY;

		const response = await axios.get(`https://whoisjson.com/api/v1/whois?domain=${domain}`, {
			headers: {
				Authorization: `TOKEN=${apiKey}`,
			},
		});

		const data = response.data;

		const creationDate = data.created;

		if (!creationDate) {
			console.log("No creation date found for this domain.");
			return { isTooYoung: false, error: "No creation date found" };
		}

		const created = new Date(creationDate);
		const now = new Date();
		const diffDays = Math.ceil(Math.abs(now - created) / (1000 * 60 * 60 * 24));

		console.log(`Domain is ${diffDays} days old.`);

		return {
			isTooYoung: diffDays < 7,
			ageInDays: diffDays,
		};
	} catch (error) {
		console.error("WhoisJSON API error details:", error.response?.data || error.message);
		return { isTooYoung: false, error: "API connection failed" };
	}
};

module.exports = { checkDomainAge };
