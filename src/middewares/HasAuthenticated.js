const Constants = require("../constants/App")
const token = require("../utils/Token")

const hasAuthenticated = async (request, response, next) => {
    let accessToken = request.get(Constants.HEADER_PARAM_AUTH);
    if (accessToken == null || accessToken.length == 0) {
        return response.status(401).json({
            message: "You need pass accessToken when make request!"
        });
    }

    try  {
        accessToken = accessToken.replace(Constants.HEADER_PREFIX_TOKEN, "")
        const tokenDecoded = await token.isValid(accessToken)
        request.userToken = tokenDecoded.token
    } catch(error) {
        return response.status(403).json({ message: "Token invalid!" });
    }

    return next();

}

module.exports = hasAuthenticated