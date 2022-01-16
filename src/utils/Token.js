const jwt = require("jsonwebtoken")

module.exports = {

    get(payload) {
        return jwt.sign(
            payload,
            process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRED_TIME }
        )
    },

    isValid(accessToken) {
        return jwt.verify(accessToken, process.env.JWT_SECRET)
    }
}