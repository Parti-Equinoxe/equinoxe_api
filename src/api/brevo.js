const axios = require("axios");
const link = "https://api.brevo.com/v3/";

/**
 * Configuration de l'api brevo
 * @type {{headers: {"accept": "application/json", "api-key": string, "content-type": "application/json"}}}
 */
module.exports.config = {
    headers: {
        "accept": "application/json",
        "api-key": process.env.TOKEN_BREVO,
        "content-type": "application/json"
    }
}

function formatError(e) {
    return {data: {full: e, error: e.toString(), message: (e.response ?? {statusText: "No message"}).statusText}};
}

/**
 * Permet de faire une requete sur l'api brevo
 * @param {String} path - l'action à effectuer (voir doc brevo)
 * @param {Array<{label: String, value:String}>} parameters - les parametres eventuels
 * @return {Promise<Object>}
 */
module.exports.get = async (path, parameters = []) => {
    return (await axios.get(`${link}${path}${parameters.length > 0 ? "?" + parameters.map(p => `${p.label}=${p.value}`) : ""}`,
        this.config).catch(formatError)).data;
}

/**
 * Permet de recupérer les informations d'un contact
 * @param email
 * @return {Promise<Object>}
 */
module.exports.getContact = async (email) => {
    return await this.get("contacts/" + email, [{label: "identifierType", value: "email_id"}]);
}