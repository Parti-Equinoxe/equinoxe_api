const axios = require("axios");
module.exports.config = {
    headers: {
        "accept": "application/json",
        "api-key": process.env.TOKEN_BREVO,
        "content-type": "application/json"
    }
}

/**
 * Permet de faire une requete sur l'api brevo
 * @param {String} path - l'action à effectuer (voir doc brevo)
 * @param {Array<{label: String, value:String}>} parameters - les parametres eventuels
 * @return {Promise<Object>}
 */
module.exports.get = async (path, parameters = []) => {
    return (await axios.get(`https://api.brevo.com/v3/${path}${parameters.length > 0 ? "?" + parameters.map(p => `${p.label}=${p.value}`) : ""}`,
        this.config).catch(e => {
        return {data: {full: e, error: e.toString(), message: (e.response ?? {statusText: "No message"}).statusText}};
    })).data;
}