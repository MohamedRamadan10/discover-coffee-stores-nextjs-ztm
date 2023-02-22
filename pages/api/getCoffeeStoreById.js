import { findRecordById } from "../../lib/airtable";

export default async function getCoffeeStoreById(req, res) {
  try {
    const { id } = req.query;
    if (id) {
      const records = await findRecordById(id);

      if (records.length !== 0) {
        res.json(records);
      } else {
        res.json({ message: "id could not be found" });
      }
    } else {
      res.status(400).json({ message: "Id is missing" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong!!", err: err.message });
  }
}
