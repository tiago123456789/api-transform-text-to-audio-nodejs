const faunadb = require("faunadb")
const q = faunadb.query;

class AudioRepository {

    constructor(clientDB) {
        this._clientDB = clientDB;
        this._collection = "audios"
    }

    update(ref, data) {
        return this._clientDB.query(
            q.Update(
                q.Ref(q.Collection(this._collection), ref),
                {
                    data: data
                }
            )
        )
    }

    findByUserToken(userToken) {
        return this._clientDB.query(
            q.Map(
                q.Paginate(
                    q.Match(
                        q.Index("findAudiosByUserToken"), userToken
                    ),
                ),
                q.Lambda(x => q.Get(x))
            )
        )
    }

    create(data) {
        return this._clientDB.query(
            q.Create(
                q.Collection(this._collection),
                {
                    data: data
                }
            )
        )
    }

}

module.exports = AudioRepository;