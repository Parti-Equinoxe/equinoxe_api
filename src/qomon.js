const axios = require("axios");
const link = "https://incoming.qomon.app/";
/**
 * Configuration de l'api qomon
 * @type {{headers: {"accept": "application/json", "Authorization": string, "content-type": "application/json","user-agent": "equinoxe/api"}}}
 */
module.exports.config = {
    headers: {
        "accept": "application/json",
        "Authorization": `Bearer ${process.env.TOKEN_QOMON}`,
        "content-type": "application/json",
        "user-agent": "equinoxe/api" // car qomon a bloquer axios comme user-agent
    },
}
function formatError(e) {
    return {
        data: {
            data: {
                full: e,
                error: e.toString(),
                message: (e.response ?? {statusText: "No message"}).statusText
            }
        }
    };
}
/**
 * Permet de faire une requete sur l'api qomon
 * @param {String} path - l'action à effectuer (voir doc qomon)
 * @param {Array<{label: String, value:String}>} parameters - les parametres eventuels
 * @return {Promise<Object>}
 */
module.exports.get = async (path, parameters = []) => {
    return (await axios.get(`${link}${path}${parameters.length > 0 ? "?" + parameters.map(p => `${p.label}=${p.value}`) : ""}`,
        ).catch(formatError)
    ).data.data;
}

/**
 * Permet de faire une requete sur l'api qomon
 * @param {String} path - l'action à effectuer (voir doc qomon)
 * @param {Object} data - les parametres eventuels
 * @return {Promise<Object>}
 */
module.exports.post = async (path, data = {}) => {
    return (await axios.post(`${link}${path}`,
            {data: data},
            this.config
        ).catch(formatError)
    ).data.data;
}