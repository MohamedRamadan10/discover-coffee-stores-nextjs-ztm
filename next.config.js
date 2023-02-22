/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
	reactStrictMode: false,
	env: {
		API_AIRTABLE_KEY: "keyisCUd82F9lIdF8",
		BASE_AIRTABLE_KEY: "appp7UhNGyoMF078V",
		API_FOURSQUARE_KEY: "fsq3pTaoDIjDkIRTTg1c4vzBlZmKAwJLAg602GEZUbOjUpE=",
		API_UNSPLASH_KEY: "3zZ_FTkRA2dLQ_3Hgn4PI5PDUaMg4wPJXQnAHw0cWBM",
	},
	images: {
		domains: ["images.unsplash.com"],
	},
};

module.exports = nextConfig;
