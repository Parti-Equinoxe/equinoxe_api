/**
 * Module pour communiquer avec l'api qomon
 * @module qomon
 */
const axios = require("axios");
const link = "https://incoming.qomon.app/";
const brevo = require("./brevo.js");
const mapping = require("./mapping.js");
const {callFromString, setFromString} = require("./utils");
const status = require("./lists_brevo.json");

/**
 * @typedef {{
 *       id: 130418611,
 *       CreatedAt: string,
 *       UpdatedAt: string,
 *       firstname: string,
 *       surname: string,
 *       mail: string,
 *       mobile: string,
 *       address: {
 *         id: number,
 *         postalcode: string,
 *         county: string,
 *         country: string,
 *         latitude: string,
 *         longitude: string
 *       },
 *       action_ids: null | Array<number>,
 *       group_id: 1818,
 *       user_id: number,
 *       tags:  Array<{ name: string, appearance_count: number }>,
 *       formdatas: Array<Object>
 *       nationbuilderid: number,
 *       membership_member: null
 *     }} Contact
 */

/**
 * Configuration de l'api qomon
 * @type {{headers: {"accept": "application/json", "Authorization": string, "content-type": "application/json","user-agent": "equinoxe/api"}}}
 */
module.exports.config = {
    headers: {
        "accept": "application/json",
        "Authorization": `Bearer ${process.env.QOMON_TOKEN}`,
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
 * Permet de faire une requete (GET) sur l'api qomon
 * @param {string} path - l'action à effectuer (voir doc qomon)
 * @param {Array<{label: string, value:string}>} parameters - les parametres eventuels
 * @return {Promise<Object>}
 */
module.exports.get = async (path, parameters = []) => {
    return (await axios.get(`${link}${path}${parameters.length > 0 ? "?" + parameters.map(p => `${p.label}=${p.value}`) : ""}`,
            this.config
        ).catch(formatError)
    ).data.data;
}

/**
 * Permet de faire une requete (POST) sur l'api qomon
 * @param {string} path - l'action à effectuer (voir doc qomon)
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

/**
 * Permet de faire une requete (PATH) sur l'api qomon
 * @param {string} path - l'action à effectuer (voir doc qomon)
 * @param {Object} data - les parametres eventuels
 * @return {Promise<Object>}
 */
module.exports.patch = async (path, data = {}) => {
    console.dir({data: data}, {depth: null});
    return (await axios.patch(`${link}${path}`,
            {data: data},
            this.config
        ).catch(formatError)
    ).data.data;
}

/**
 * Permet de recuperer l'id d'un contact
 * @param {string} email - l'action à effectuer (voir doc qomon)
 * @return {Promise<string>} - l'id du contact / 0 si pas trouvé
 */
module.exports.getID = async (email) => {
    const res = await this.post("search", {
        "advanced_search": {
            "per_page": 20,
            query: {
                "$all": [
                    {
                        "$at_least_one": [
                            {
                                "$condition": {
                                    attr: "mail",
                                    ope: "eql",
                                    value: email
                                }
                            }
                        ]
                    }
                ]
            }
        }
    });
    if (!res.contacts || res.contacts.length === 0) return "0";
    return (res.contacts.find(c => c.mail === email) ?? {id: 0}).id.toString() ?? "0";
}

/**
 * Permet de ajouter / mettre a jour un contact
 * @param {string} email - l'email du contact
 * @return {Promise<Contact | {error: string, full?: Object}>}
 */
module.exports.getContact = async (email) => {
    const userID = await this.getID(email);
    if (userID === "0") return {error: "Contact not found"};
    const userData = await this.get(`contacts/${userID}`);
    if (!userData.contact && !userData.error) return {error: "No data found", full: userData};
    return userData.contact ?? userData;
}

const fieldDelete = ["CreatedAt", "UpdatedAt", "action_ids", "group_id", "user_id", "formdatas", "nationbuilderid", "membership_member"]
/**
 * Permet mettre a jour un contact
 * @param {string} email - l'email du contact
 * @param {Object} newData - les donne du contact à mettre à jour
 * @return {Promise<Object>}
 */
module.exports.updateContact = async (email, newData) => {
    const userData = await this.getContact(email);
    if (userData.error) return userData;
    const data = {
        ...userData,
        ...newData
    };
    for (const field of fieldDelete) {
        delete data[field];
    }
    console.dir(data, {depth: null});
    return (await axios.post(`${link}contacts/upsert`,
            {kind: "contact", data: data},
            this.config
        ).catch(formatError)
    ).data;
}

/**
 * Permet de supprimer un contact
 * @param {string} email - l'email du contact
 * @return {Promise<Object>}
 */
module.exports.deleteContact = async (email) => {
    const userID = await this.getID(email);
    if (userID === "0") return {error: "Contact not found"};
    return (await axios.delete(`${link}contacts/${userID}`, this.config).catch(formatError));
}

/**
 * Permet de creer un contact
 * @param {string} email - l'email du contact
 * @return {Promise<Object>}
 */
module.exports.createContact = async (email) => {
    const userID = await this.getID(email);
    if (userID !== "0") return {error: "Contact already exists"};
    const rawData = await brevo.getContact(email);
    console.dir(rawData, {depth: null});
    let data = {};
    for (const field of mapping) {
        const val = callFromString(rawData, field.brevo);
        if (!val) continue;
        data = setFromString(data, field.qomon, field.transform(val));
    }
    data.tags = [
        {
            "name": "TEST",
            "appearance_count": 0,
            "color": "#ff0000"
        }
    ]
    if (!data.mail) data.mail = email;
    if (rawData.listIds) {
        data.status = rawData.listIds.filter(id => status.filters.brevo.includes(id)).map((id) => status.status.find((s) => s.id_brevo === id))
            .map((list) => {
                return {
                    label: "Niveau de soutien",
                    value: list.id_qomon
                }
            });
    }
    console.dir(data, {depth: null});
    /*return (await axios.post(`${link}contacts/upsert`,
            {kind: "contact", data: data},
            this.config
        ).catch(formatError)
    ).data;*/
    //TODO: activer la creation de contact
    return data;
}