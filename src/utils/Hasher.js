const bcrypt = require("bcrypt");

module.exports = {

    get(value) {
        return bcrypt.hash(value, 10)
    },

    compare(hash, value) {
        return bcrypt.compare(value, hash)
    }
}