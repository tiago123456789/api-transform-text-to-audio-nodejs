const client = require("../configs/Database");
const UserRepository = require("../repositories/UserRepository")
const AudioRepository = require("../repositories/AudioRepository")
const UserService = require("../services/UserService")
const AudioService = require("../services/AudioService")
const TextToAudioService = require("../services/TextToAudioService")

const userRepository = new UserRepository(client)
const audioRepository = new AudioRepository(client)
const token = require("../utils/Token");
const hasher = require("../utils/Hasher")
const languageSupportedUtils = require("../utils/LanguageSupported")

const Constants = require("../constants/App")

const Queue = require("../queue/Queue");
const hasAuthenticated = require("../middewares/HasAuthenticated");
const HandlerException = require("../middewares/HandlerException");
const audioQueue = new Queue(Constants.QUEUE.AUDIO);

const userService = new UserService(userRepository, hasher, token)
const audioService = new AudioService(audioRepository, audioQueue, languageSupportedUtils)
const textToAudoService = new TextToAudioService(languageSupportedUtils);

module.exports = (app) => {

    app.post("/auth/register", async (request, response, next) => {
        const data = request.body;
        try {
            await userService.register(data);
            return response.sendStatus(201)
        } catch(error) {
            next(error);
        }
    })

    app.post("/auth/login", async (request, response, next) => {
        const credentials = request.body;
        try {
            const accessToken = await userService.login(credentials);;
            return response.status(200).json({ accessToken })
        } catch(error) {
            next(error);
        }
    })

    app.post("/audios", hasAuthenticated, async (request, response, next) => {
        const data = request.body;
        data.user_token = request.userToken;
        try {
            await audioService.create(data);
            return response.sendStatus(201)
        } catch(error) {
            next(error);
        }
    })

    app.get("/audios", hasAuthenticated, async (request, response, next) => {
        try {
            const audios = await audioService.listByUserToken(request.userToken);
            return response.status(200).json(audios);
        } catch(error) {
            next(error);
        }
    })

    app.get("/download-audios/:filename", hasAuthenticated, async (request, response, next) => {
        try {
            const linkDownloadAudio = await textToAudoService
                                        .getLinkDownloadAudio(request.params.filename);
            return response.json({ linkDownloadAudio })
        } catch(error) {
            next(error);
        }
    })

    // Middleware to handler exceptions
    app.use(HandlerException)

}