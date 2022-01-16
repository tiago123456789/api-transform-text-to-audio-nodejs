const languageSupported = {
    "en-US": "Joanna",
    "pt-BR": "Camila"
}

module.exports = {

    getVoiceByLanguage(language) {
        return languageSupported[language]
    },

    isValidLanguage(language) {
        return languageSupported[language] != null
    }
}