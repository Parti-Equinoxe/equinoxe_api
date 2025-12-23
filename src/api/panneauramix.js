/**
 * Module pour gérer l'app panneauramix
 * @module panneauramix
 */
const {tables, fieldsNames} = require("./baserow.js");
const {get, post, patch, getContact} = require("./baserow");

/**
 * Permet de recuper les informations d'un panneau par son id baserow
 * @param data {Object} - les donnees du panneau
 * @return {Object}
 */
module.exports.setMaj = async (data, userID) => {
    data["1-Dernière personne a avoir modifié"] = parseInt(userID);
    data["Dernière modification"] = new Date().toISOString();
    return data;
}

/**
 * Permet de recuper les informations d'un panneau par son id baserow
 * @param id - ID du panneau
 * @return {Promise<*>}
 */
module.exports.getPanneau = async (id) => {
    return await get(`database/rows/table/${tables.panneau}/${id}/`, [fieldsNames]);
}

/**
 * Permet de modifier les informations d'un panneau par son id baserow
 * @param id - ID du panneau
 * @param data - Données du panneau
 * @param userID {Contact.id} - Personne qui modifie
 * @return {Promise<*>}
 */
module.exports.editPanneau = async (id, data, userID) => {
    return await patch(`database/rows/table/${tables.panneau}/${id}/`, [fieldsNames], this.setMaj(data, userID));
}

/**
 * Permet de créer un nouveau panneau
 * @param data - Données du panneau
 * @param userID {Contact.id} - Personne qui créer
 * @return {Promise<*>}
 */
module.exports.newPanneau = async (data, userID) => {
    data["1-Dernière personne a avoir modifié"] = parseInt(userID);
    data["Dernière modification"] = parseInt(userID);
    const result = await post(`database/rows/table/${tables.panneau}/`, [fieldsNames], data)
    return result.data;
}

/**
 * Permet d'informer qu'un panneau doit être supprime
 * @param data - Données du panneau
 * @param userID {Contact.id} - Personne qui créer
 * @return {Promise<*>}
 */
module.exports.deletePanneau = async (userID) => {
    const data = {
        "1-Dernière personne a avoir modifié": parseInt(userID),
        //"Dernière modification: new Date().toISOString(),
        "A Supprimer ?": true
    };
    const result = await post(`database/rows/table/${tables.panneau}/`, [fieldsNames], data)
    return result.data;
}

/**
 * Permet de notifier qu'une affiche a été collé sur un panneau
 * @param id - ID du panneau
 * @param userID {Contact.id} - Personne qui a collé
 * @return {Promise<*>}
 */
module.exports.collagePanneau = async (id, userID) => {
    const panneau = await this.getPanneau(id);
    if (panneau.error) return panneau;
    const data = {
        "1-Dernière personne passée": parseInt(userID),
        "Décollées ?": false,
        "Date dernier passage": new Date().toISOString(),
        "Compteur": parseInt(panneau["Compteur"]) + 1
    };
    const result = await patch(`database/rows/table/${tables.panneau}/${id}/`, [fieldsNames], data);
    return result.data;
}

/**
 * Permet d'envoyer un nombre réduit d'information
 * @param panneau {Panneau}
 * @return {{id, Nom, Longitude, Latitude, "A Supprimer", Adresse, "Date dernier passage"}}
 */
module.exports.info = (panneau) =>{
    return {
        id: panneau.id,
        "Nom": panneau["Nom"],
        "Longitude": panneau["Longitude"],
        "Latitude": panneau["Latitude"],
        "A Supprimer": panneau["A Supprimer"],
        "Adresse": panneau["Adresse"],
        "Date dernier passage": panneau["Date dernier passage"]
    }
}

/**
 * Permet de recuper les id des panneaux d'une commune par son id baserow
 * @param id_commune {Commune.id} - ID de la commune
 * @param page {number} - Numéro de la page
 * @return {Promise<Array<{id: string, Nom: string}>>}
 */
module.exports.getPanneauxCommune = async (id_commune, page = 1) => {
    if (page < 1) return {error: "Bad request", message: "page number must be superior or equal to 1"}
    const result = await get(`database/rows/table/${tables.panneau}/`, [fieldsNames, {
        label: "filters",
        value: JSON.stringify({
            "filter_type": "AND",
            "filters": [{"type": "link_row_has", "field": "11-Commune du panneau", "value": `${id_commune}`}],
            "groups": []
        })
    }, {
        label: "page",
        value: page
    }]);
    if (!result || result.count === 0 || !result.results) return [];
    return result.results.map((panneau) => {
        return module.exports.info(panneau);
    });
}

/**
 * Permet de recuper les id des panneaux d'une commune par son id baserow
 * @param id_circo - ID de la circonscription
 * @param page {number} - Numéro de page
 * @return {Promise<Array<{id: string, Nom: string}>>}
 */
module.exports.getPanneauxCirco = async (id_circo, page = 1) => {
    if (page < 1) return {error: "Bad request", message: "page number must be superior or equal to 1"}
    const result = await get(`database/rows/table/${tables.panneau}/`, [fieldsNames, {
        label: "filters",
        value: JSON.stringify({
            "filter_type": "AND",
            "filters": [{"type": "link_row_has", "field": "13-Circonscriptions", "value": `${id_circo}`}],
            "groups": []
        })
    }, {
        label: "page",
        value: page
    }]);
    if (!result || result.count === 0 || !result.results) return [];
    return result.results.map((panneau) => {
        return module.exports.info(panneau);
    });
}

/**
 * Permet de recuper les id des panneaux d'une commune par son id baserow
 * @param lon_min {float} - Longitude minimale
 * @param lon_max {float} - Longitude maximale
 * @param lat_min {float} - Latitude minimale
 * @param lat_max {float}- Latitude maximale
 * @param page {number} - Numéro de la page
 * @return {Promise<Array<{id: string, Nom: string}>>}
 */
module.exports.getPanneauxInSquare = async (lon_min, lon_max, lat_min, lat_max, page = 1) => {
    if (page < 1) return {error: "Bad request", message: "page number must be superior or equal to 1"}
    const result = await get(`database/rows/table/${tables.panneau}/`, [fieldsNames, {
        label: "filters",
        value: JSON.stringify({
            "filter_type": "AND",
            "filters": [{
                "type": "higher_than_or_equal",// a modifier
                "field": "Longitude",
                "value": lon_min
            }, {
                "type": "lower_than_or_equal",// a modifier
                "field": "Longitude",
                "value": lon_max
            }, {
                "type": "higher_than_or_equal",// a modifier
                "field": "Latitude",
                "value": lat_min
            }, {
                "type": "lower_than_or_equal",// a modifier
                "field": "Latitude",
                "value": lat_max
            }],
            "groups": []
        })
    }, {
        label: "page",
        value: page
    }]);
    if (!result || result.count === 0 || !result.results) return [];
    return result.results.map((panneau) => {
        return module.exports.info(panneau);
    });
}