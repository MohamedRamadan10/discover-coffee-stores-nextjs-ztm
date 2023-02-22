import { findRecordById, getMinifiedRecords, table } from "../../lib/airtable";

export default async function createStore(req, res) {
	if (req.method === "POST") {
		const { id, name, imgUrl, distance, location, vote } = req.body;
		try {
			if (id) {
				const records = await findRecordById(id);

				if (records.length !== 0) {
					res.json(records);
				} else {
					if (name) {
						const createRecords = await table.create([
							{
								fields: { id, name, imgUrl, distance, location, vote },
							},
						]);
						const records = getMinifiedRecords(createRecords);
						res.json({ message: "Create a record", records });
					} else {
						res.status(400).json({ message: "Name is missing" });
					}
				}
			} else {
				res.status(400).json({ message: "Id is missing" });
			}
		} catch (err) {
			console.log("Error creating or finding store", err);
			res.status(500).json({
				message: "Error creating or finding store",
				err: err.message,
			});
		}
	}
}
