const client = require("../configs/Database");
const AudioRepository = require("../repositories/AudioRepository")
const TextToAudioService = require("../services/TextToAudioService")
const languageSupportedUtils = require("../utils/LanguageSupported")
const audioRepository = new AudioRepository(client);
const textToAudioService = new TextToAudioService(languageSupportedUtils)

module.exports = async (job, done) => {
    const data = job.data;
    console.log(`Init process to transform text to audio ${new Date().toUTCString()}`)
    const textTransformedAudio = await textToAudioService.transform(data.data.text, data.data.language);
    const audio_link = textTransformedAudio.SynthesisTask.OutputUri;
    let urlReplace = `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.S3_BUCKET}/`
    const filename = textTransformedAudio.SynthesisTask.OutputUri.replace(urlReplace, "")
    await audioRepository.update(
        data.audioCreated.ref["@ref"].id, { audio_link, filename }
    );
    console.log(`Processed to transform text to audio ${new Date().toUTCString()}`)
    done();
}