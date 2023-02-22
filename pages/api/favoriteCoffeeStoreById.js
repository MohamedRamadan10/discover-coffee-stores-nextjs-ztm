import { findRecordById, getMinifiedRecords, table } from "../../lib/airtable";

export default async function favoriteCoffeeStoreById(req, res) {
  if (req.method === "PUT") {
    try {
      const { id } = req.query;
      if (id) {
        const records = await findRecordById(id);

        if (records.length !== 0) {
          const record = records[0];
          const calcVote = parseInt(record.vote) + 1;
          const updateVote = await table.update([
            {
              id: record.recordId,
              fields: {
                vote: calcVote,
              },
            },
          ]);
          if (updateVote) {
            const minifiedRecord = getMinifiedRecords(updateVote);
            res.json(minifiedRecord);
          }
        } else {
          res.json({ message: "id could not be found" });
        }
      } else {
        res.status(400).json({ message: "Id is not exist" });
      }
    } catch (err) {
      res.status(500).json({ message: "Error up voting", err: err.message });
    }
  }
}
