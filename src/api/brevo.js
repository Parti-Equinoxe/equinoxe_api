const axios = require("axios");
const link = "https://api.brevo.com/v3/";
const status = require("./status.json");

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
 * @return {Promise<Object>}
 */
module.exports.getContact = async (email) => {
    return await this.get("contacts/" + email, [{label: "identifierType", value: "email_id"}]);
}

/**
 * Permet de recupérer les informations d'un contact
 * @param {string} userID - l'id discord
 * @return {Promise<Object>}
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
 * @param {string} data - les donnes a mettre a jours
 * @return {Promise<Object>}
 */
module.exports.updateContact = async (email, data) => {
    return await this.put("contacts/" + email, data, [{label: "identifierType", value: "email_id"}]);
}

/**
 * Permet de recupérer le status d'un contact
 * @param {{email: string}|{userID: string}|{id: string}} identifier
 * @return {Promise<{adh: boolean, symp: boolean}>}
 */
module.exports.getStatus = async (identifier) => {
    let resp;
    if (identifier.hasOwnProperty("email")) {
        resp = await this.getContact(identifier.email);
    }
    if (identifier.hasOwnProperty("userID")) {
        resp = await this.getContactFromDiscord(identifier.userID);
    }
    if (identifier.hasOwnProperty("ID")) {
        resp = (await this.get("contacts/" + identifier.ID, [{label: "identifierType", value: "contact_id"}]));
    }
    if (!resp) resp = {listIds: []};
    const lists = resp.listIds.filter(id => status.filters.brevo.includes(id)).map((id) => status.status.find((s) => s.id_brevo === id));
    return {
        adh: !!lists.find(l => l.name === "Adhérents"),
        symp: !!lists.find(l => l.name === "Sympathisants")
    };
}