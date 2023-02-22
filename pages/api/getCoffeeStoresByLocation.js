import { fetchCoffeeStores } from "../../lib/coffee-stores";

export default async function getCoffeeStoresByLocation(req, res) {
	try {
		const { latLong, limit } = req.query;
		const coffeeStores = await fetchCoffeeStores(latLong, limit);

		res.status(200).json({
			status: "success",
			coffeeStores,
		});
	} catch (err) {
		console.log(err);
		res
			.status(500)
			.json({ message: "oh no! something went wrong.", err: err.message });
	}
}
