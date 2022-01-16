const faunadb = require("faunadb")
const client = new faunadb.Client({ secret: process.env.DB_SECRET });

module.exports = client;