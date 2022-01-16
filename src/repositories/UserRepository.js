const uuid = require("uuid")
const faunadb = require("faunadb")
const q = faunadb.query;

class UserRepository {

    constructor(clientDB) {
        this._clientDB = clientDB;
        this._collection = "users"
    }

    create(data) {
        data.token = uuid.v4();
        return this._clientDB.query(
            q.Create(
                q.Collection(this._collection),
                {
                    data: data
                }
            )
        )
    }

    findByEmail(email) {
        return this._clientDB.query(
            q.Get(
                q.Match(
                    q.Index("findByEmail"), email
                )
            )
        );
    }
}

module.exports = UserRepository;