const InvalidDataException = require("../exceptions/InvalidDataException");

class AudioService {

    constructor(audioRepository, audioQueue, languageUtils) {
        this.audioRepository = audioRepository;
        this.audioQueue = audioQueue;
        this.languageUtils = languageUtils;
    }

    async create(data) {
        if (!this.languageUtils.isValidLanguage(data.language)) {
            throw new InvalidDataException("Language not supported. In this moment language support are: en-US, pt-BR")
        }
        const audioCreated = await this.audioRepository.create(data);
        return this.audioQueue.publish({ data, audioCreated });
    }

    listByUserToken(userToken) {
        return this.audioRepository.findByUserToken(userToken);
    }

}

module.exports = AudioService;

