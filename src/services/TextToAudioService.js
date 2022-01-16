const uuid = require("uuid")
const AWS = require('aws-sdk')
const s3 = new AWS.S3({ region: process.env.AWS_REGION })
const Polly = new AWS.Polly({
    signatureVersion: 'v4',
    region: process.env.AWS_REGION
});

class TextToAudioService {

    constructor(languageUtils) {
        this.languageUtils = languageUtils
    }

    transform(text, language) {

        let params = {
            'Text': text,
            'OutputFormat': 'mp3',
            'VoiceId': this.languageUtils.getVoiceByLanguage(language)
        }

        return Polly.startSpeechSynthesisTask({
            ...params, 
            LanguageCode: language,
            Engine: "neural",
            OutputS3BucketName: process.env.S3_BUCKET,
            OutputS3KeyPrefix: uuid.v4()
        })
        .promise()
    }

    getLinkDownloadAudio(filename) {
        const presignedUrl = s3.getSignedUrl('getObject', {
            Bucket: process.env.S3_BUCKET,
            Key: filename, 
            Expires: 20 
        });

        return presignedUrl;
    }
}

module.exports = TextToAudioService;