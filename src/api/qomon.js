const axios = require("axios");
const link = "https://incoming.qomon.app/";

// TODO: Stocker la dernier request si une erreur ce produit

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
            this.config
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

/**
 * Permet de faire une requete sur l'api qomon
 * @param {String} path - l'action à effectuer (voir doc qomon)
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
 * @param {String} email - l'action à effectuer (voir doc qomon)
 * @return {Promise<String>} - l'id du contact / 0 si pas trouvé
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
 * @param {String} email - l'email du contact
 * @return {Promise<Object>}
 */
module.exports.getContact = async (email) => {
    const userID = await this.getID(email);
    if (userID === "0") return {error: "Contact not found"};
    const userData = await this.get(`contacts/${userID}`);
    if (!userData.contact && !userData.error) return {error: "No data found", full: userData};
    return userData.contact ?? userData;
}

const fieldDelete = ["CreatedAt","UpdatedAt","action_ids", "group_id", "user_id", "formdatas", "nationbuilderid", "membership_member"]
/**
 * Permet de ajouter / mettre a jour un contact
 * @param {String} email - l'email du contact
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

module.exports.deleteContact = async (email) => {
    const userID = await this.getID(email);
    if (userID === "0") return {error: "Contact not found"};
    return (await axios.delete(`${link}contacts/${userID}`, this.config).catch(formatError));
}