const axios = require("axios");
const link = "https://api.brevo.com/v3/";
const status = require("./lists_brevo.json");

/**
 * @typedef {{
 *   email: string,
 *   id: number,
 *   emailBlacklisted: boolean,
 *   smsBlacklisted: boolean,
 *   createdAt: string,
 *   modifiedAt: string,
 *   attributes: {
 *     PRENOM?: string,
 *     SMS?: string,
 *     VILLE?: string,
 *     CODE_POSTAL?: string,
 *     NOM?: string
 *     GENDER?: string,
 *     DISCORD_ID?: string,
 *     DISCORD_REFRESH_TOKEN?: string
 *   },
 *   listIds: Array<number>,
 *   statistics: Object
 * }} Contact
 */

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
 * Permet de faire une requete (GET) sur l'api brevo
 * @param {string} path - l'action à effectuer (voir doc brevo)
 * @param {Array<{label: string, value: string}>} parameters - les parametres eventuels
 * @return {Promise<Object>}
 */
module.exports.get = async (path, parameters = []) => {
    return (await axios.get(`${link}${path}${parameters.length > 0 ? "?" + parameters.map(p => `${p.label}=${p.value}`) : ""}`,
        this.config
    ).catch(formatError)).data;
}
/**
 * Permet de faire une requete (PUT) sur l'api brevo
 * @param {string} path - l'action à effectuer (voir doc brevo)
 * @param {Array<{label: string, value: string}>} parameters - les parametres eventuels
 * @return {Promise<Object>}
 */
module.exports.put = async (path, data, parameters = []) => {
    return (await axios.put(`${link}${path}${parameters.length > 0 ? "?" + parameters.map(p => `${p.label}=${p.value}`) : ""}`,
        data,
        this.config
    ).catch(formatError)).data;
}

/**
 * Permet de recupérer les informations d'un contact
 * @param {string} email
 * @return {Promise<Contact>}
 */
module.exports.getContact = async (email) => {
    return await this.get("contacts/" + email, [{label: "identifierType", value: "email_id"}]);
}

/**
 * Permet de recupérer les informations d'un contact
 * @param {string} id - l'ID brevo du contact
 * @return {Promise<Contact>}
 */
module.exports.getContactFromId = async (id) => {
    return await this.get("contacts/" + id, [{label: "identifierType", value: "contact_id"}]);
}

/**
 * Permet de recupérer les informations d'un contact
 * @param {string} userID - l'id discord
 * @return {Promise<Contact>}
 */
module.exports.getContactFromDiscord = async (userID) => {
    const resp = (await this.get("contacts/", [{
        label: "filter",
        value: `equals(DISCORD_ID,"${userID}")`
    }])).data;
    console.dir(resp, {death: null});
    return resp.find((c) => c.attributes.DISCORD_ID === userID);
}

/**
 * Permet de mettre a jour les informations d'un contact
 * @param {string} email
 * @param {Contact} data - les donnes a mettre a jours
 * @return {Promise<Object>}
 */
module.exports.updateContact = async (email, data) => {
    return await this.put("contacts/" + email, data, [{label: "identifierType", value: "email_id"}]);
}

/**
 * Permet de recupérer le status d'un contact
 * @param {Array<number>} listIds
 * @return {{adh: boolean, symp: boolean}}
 */
module.exports.transformList = (listIds) => {
    //const lists = listIds.filter(id => status.filters.brevo.includes(id)).map((id) => status.status.find((s) => s.id_brevo === id));
    return status.status.reduce((acc, current)=>{
        acc[current.name] = listIds.includes(current.id_brevo);
        return acc;
    },{});
}

/**
 * Permet de savoir si ce contact a lié son compte discord ou pas
 * @param {string} email
 * @param {string} userID - l'id discord
 * @return {Promise<boolean>}
 */
module.exports.isLinked = async (email, userID) => {
    const userData = await this.getContact(email);
    if (!userData) return false;
    return userData.attributes.DISCORD_ID ?? "" === userID;
}