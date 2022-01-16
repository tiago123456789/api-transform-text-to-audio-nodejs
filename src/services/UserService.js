const InvalidDataException = require("../exceptions/InvalidDataException");

class UserService {

    constructor(userRepository, hasher, token) {
        this.userRepository = userRepository;
        this.hasher = hasher;
        this.token = token
    }

    async register(data) {
        data.password = await this.hasher.get(data.password)
        return userRepository.create(data)
    }

    async login(credentials) {
        if (credentials.email == null || credentials.password == null) {
            throw new InvalidDataException("You need informated email and password!");
        }
    
        const userByEmail = await this.userRepository.findByEmail(credentials.email);
        if (userByEmail == null) {
            throw new InvalidDataException("Credentials invalid!")
        }
    
        const isValidPasswordTyped = await this.hasher.compare(
            userByEmail.data.password, credentials.password
        )
    
        if (!isValidPasswordTyped) {
            throw new InvalidDataException("Credentials invalid!");
        }
    
        const accessToken = this.token.get(
            { email: userByEmail.data.email, token: userByEmail.data.token }
        )

        return accessToken;
    }
}

module.exports = UserService;