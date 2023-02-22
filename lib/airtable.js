const airtable = require("airtable");
const base = new airtable({
  apiKey: process.env.API_AIRTABLE_KEY,
}).base(process.env.BASE_AIRTABLE_KEY);

const table = base("coffee-stores");

const getMinifiedRecord = (record) => {
  return { recordId: record.id, ...record.fields };
};

const getMinifiedRecords = (records) => {
  return records.map((record) => getMinifiedRecord(record));
};

const findRecordById = async (id) => {
  const findCoffeeStoreRecords = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();

  return getMinifiedRecords(findCoffeeStoreRecords);
};

export { table, getMinifiedRecords, findRecordById };
