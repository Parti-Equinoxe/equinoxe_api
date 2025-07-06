/**
 * Module pour communiquer avec l'api baserow
 * @module baserow
 */
const axios = require("axios");
const link = "https://api.baserow.io/api/";


/**
 * @typedef {{
 *     id: number,
 *     order: string,
 *     "Nom complet test": string,
 *     "Nom complet": string,
 *     Date: string,
 *     "1-Organisateurs": Array<{id: number, value: string}>,
 *     Type: {
 *         id: number
 *         value: string,
 *         color: string
 *     },
 *     "N° département": string,
 *     "Ville": string,
 *     "Réunion": {
 *         id: number
 *         value: string,
 *         color: string
 *     },
 *     "Catégorie": {
 *         id: number
 *         value: string,
 *         color: string
 *     },
 *     "4-Participants-et-CR": Array<{id: number, value: string}>,
 *     "Ont participé": Array<{id: number, value: string}>,
 *     "Photos": Array<*>,
 *     "Compte rendu": string,
 *     "Nom": string,
 *     "3-Inscriptions événements": Array<{id: number, value: string}>,
 *     "URL": string,
 *     "Public ?": {
 *         id: number
 *         value: string,
 *         color: string
 *     },
 *     "Besoin de contacts": {
 *         id: number
 *         value: string,
 *         color: string
 *     },
 *     "Logo": string,
 *     "Mails inscrits": string,
 *     "Formulaire d'inscription": string,
 *     "Inscrits": Array<{id: number, value: string}>,
 *     "Evénement public ?": {
 *         id: number
 *         value: string,
 *         color: string
 *     },
 *     "Téléphone inscrits": string,
 *     "Nombre d'inscrits": number
 *     "# Participants": number
 *     "Nombre de participants": string,
 *     "Lieu de rendez-vous": string,
 *     "Description de l'événement": string,
 *     Lieu: string,
 *     "Description Wordpress": string,
 *     Extract: string,
 *     "Titre Wordpress": string,
 *     "Personne rencontrée": string,
 *     "Arrondissement": number
 *     "Thème": string,
 *     "Type de rencontre": {
 *         id: number
 *         value: string,
 *         color: string
 *     },
 *     Jour: string,
 *     Mois: string,
 *     "SMS auto": string,
 *     "Numéros inscrits": string,
 *     "Contenu SMS": string,
 *     "Evénement public (site)": string,
 *     "11-Ville": Array<{id: number, value: string}>,
 *     "9-Equipes Municipales": Array<{id: number, value: string}>,
 *     "Localité": string,
 *     "Commune test": string,
 *     "Nom test": string,
 *     "5-Région": Array<{id: number, value: string}>,
 *     "5-Département": Array<{id: number, value: string}>
 * }} Evenement
 */

/**
 * @typedef {{
 *     id: number
 *     order: string,
 *     Contact: string,
 *     Nom: string,
 *     "Activité": string,
 *     "Prénom": string,
 *     "Département": Array<{id: number, value: string}>,
 *     "2-A organisé": Array<{id: number, value: string}>,
 *     Statut: {
 *         id: number
 *         value: string,
 *         color: string
 *     },
 *     "Présence événements": string,
 *     Organise: string,
 *     Courriel: string,
 *     "Téléphone": "+1-541-754-3010",
 *     "Code postal": number
 *     "Ville formulaire": string,
 *     CP: string,
 *     Implication: Array<{id: numbervalue: string, color: string}>,
 *     "Dernière organisation": "2020-01-01",
 *     "Dernière activité": "2020-01-01",
 *     "4-Participants-et-CR": Array<{id: number, value: string}>,
 *     "A participé": Array<{id: number, value: string}>,
 *     "Dernière participation": "2020-01-01",
 *     Phoning: string,
 *     "Apéro": string,
 *     "Débat": string,
 *     "Fresque": string,
 *     "Présentation": string,
 *     Tractage: string,
 *     "Étoiles": string,
 *     "Σ★": string,
 *     "Date inscription brute": string,
 *     "Inscrit le": string,
 *     Whatsapp: string,
 *     "3-Inscriptions-et-appels": Array<{id: number, value: string}>,
 *     "3-A appelé": Array<{id: number, value: string}>,
 *     WhatsApp: string,
 *     "OK appel": string,
 *     "Réponses événements": string,
 *     "Dernier appel": string,
 *     "Appelant attribué": string,
 *     "Dernier SMS": string,
 *     "Appelant lié": Array<{id: number, value: string}>,
 *     "Picto appel": string,
 *     "MàJ Ville": string,
 *     "MàJ Code postal": string,
 *     Ville: string,
 *     "CP intermédiaire": string,
 *     "Créneau": string,
 *     "5-Accès_BDD": Array<{id: number, value: string}>,
 *     "Nom prénom": string,
 *     "Sexe déterminé par IA": {
 *         id: number
 *         value: string,
 *         color: string
 *     },
 *     "Sauvegarde statut": {
 *         id: number
 *         value: string,
 *         color: string
 *     },
 *     "Date adhésion brute": string,
 *     Sexe: string,
 *     "Date de naissance": "2020-01-01",
 *     Pays: string,
 *     "Tél": string,
 *     "Âge": number
 *     "Groupe Local": Array<{id: number, value: string}>,
 *     "8-Réponse questionnaires": Array<{id: number, value: string}>,
 *     "A répondu au questionnaire": Array<{id: number, value: string}>,
 *     "Sympathise via inscription événement": true,
 *     "Rôle": Array<{id: number, value: {id: numbervalue: string, color: string}}>,
 *     "Projet Municipales 2026": Array<{id: number, value: string}>,
 *     "Motivation Municipal 2026": Array<{id: number, value: Array<{id: numbervalue: string, color: string}>}>,
 *     "11-Municipales - 1-Membres Equinoxe": Array<{id: number, value: string}>,
 *     "9-Equipes Municipales": Array<{id: number, value: string}>,
 *     "9-Equipes Municipales - Membres de l'équipe": Array<{id: number, value: string}>,
 *     "Adhésion le": "2020-01-01",
 *     "1-Parrain/marraine": Array<{id: number, value: string}>,
 *     "Région": Array<{id: number, value: string}>,
 *     "CP - Ville": string,
 *     "12-Panneaux d'affichage": Array<{id: number, value: string}>
 * }} Contact
 */

/**
 * @typedef {{
 *     id: number,
 *     order: string,
 *     Identifiant: string,
 *     "Code insee": string,
 *     insee_5: string,
 *     CP: string,
 *     ancien_code_pivot: string,
 *     Commune: string,
 *     nom_commune_1: string,
 *     nom_commune_2: string,
 *     CP_alternatif: string,
 *     Departement: string,
 *     Region: string,
 *     Circonscriptions: string,
 *     gares: string,
 *     "Site internet": string,
 *     mail: string,
 *     "Téléphone": string,
 *     "Adresse mairie": string,
 *     "Complément adresse 1": string,
 *     "Complément adresse 2": string,
 *     Pays: string,
 *     longitude: string,
 *     latitude: string,
 *     url_service_public: string,
 *     date_modification: string,
 *     formulaire_contact: string,
 *     "Nombre d'habitants (2021)": number,
 *     "Inscrits_europeennes_2024": string,
 *     "Votants_europeennes_2024": string,
 *     "Abstentions_europeennes_2024": string,
 *     "Exprimés_europeennes_2024": string,
 *     "Blancs_europeennes_2024": string,
 *     "Nuls_europeennes_2024": string,
 *     "Votes Equinoxe europeennes_2024": string,
 *     "Votes Equinoxe (%) europeennes_2024": string,
 *     "Votes RN europeennes_2024": string,
 *     "Votes RN (%) europeennes_2024": string,
 *     "Votes LFI europeennes_2024": string,
 *     "Votes LFI (%) europeennes_2024": string,
 *     "Votes Europe ecologie europeennes_2024": string,
 *     "Votes Europe ecologie (%) europeennes_2024": string,
 *     "Votes PARTI DES CITOYENS EUROPÉENS europeennes_2024": string,
 *     "Votes PARTI DES CITOYENS EUROPÉENS (%) europeennes_2024": string,
 *     "Votes ECOLOGIE POSITIVE ET TERRITOIRES europeennes_2024": string,
 *     "Votes ECOLOGIE POSITIVE ET TERRITOIRES (%) europeennes_2024": string,
 *     "Votes EUROPE TERRITOIRES ÉCOLOGIE europeennes_2024": string,
 *     "Votes EUROPE TERRITOIRES ÉCOLOGIE (%) europeennes_2024": string,
 *     "Votes Place Publique europeennes_2024": string,
 *     "Votes Place Publique (%) europeennes_2024": string,
 *     "1-Membres Equinoxe": Array<{id: number, value: string}>,
 *     "2-Événements": Array<{id: number, value: string}>,
 *     "Fiche profil": Array<*>,
 *     "Lien questionnaire EdT": string,
 *     "Avancement Municipales 2026": {
 *         id: number
 *         value: string,
 *         color: string
 *     },
 *     "8-Réponses-questionnaires": Array<{id: number, value: string}>,
 *     "Statut": Array<{id: number, value: {id: numbervalue: string, color: string}}>,
 *     "A participé": Array<{id: number, value: string}>,
 *     "Lieu évènements": Array<{id: number, value: string}>,
 *     "5-Département": Array<{id: number, value: string}>,
 *     "12-Panneaux d'affichage": Array<{id: number, value: string}>
 * }} Commune
 */

/**
 * Configuration pour se connecter à l'api baserow
 * @type {{url: string, headers: {Authorization: string}}}
 **/
module.exports.config = {
    headers: {
        Authorization: `Token ${process.env.BASEROW_TOKEN}`,
        "Content-Type": "application/json"
    }
};

/**
 * A passé en paramètre pour les requetes baserow, pour avoir les noms des champs lisible
 * @type {{label: string, value: string}}
 */
module.exports.fieldsNames = {
    label: "user_field_names",
    value: "true"
};

/**
 * List des tables du baserow
 * @type {{adh_symp: number, event: number, commune: number, panneau: number, circuit: number, circo: number}}
 */
module.exports.tables = {
    adh_symp: 220744,
    event: 220745,
    commune: 478573,
    panneau: 518189,
    circuit: 594949,
    circo: 531292
};

function formatError(e) {
    return {
        data: {
            error: e.toString(),
            message: `${e.response.data.error} : ${JSON.stringify(e.response.data.detail)}`,
            full: e
        }
    };
}

/**
 * Permet de faire une requete (GET) sur l'api brevo
 * @param {string} path - l'action à effectuer (voir doc brevo)
 * @param {Array<{label: string, value: string}>} parameters - les parametres eventuels
 * @return {Promise<Object>}
 */
module.exports.get = async (path, parameters = []) => {
    return (await axios.get(`${link}${path}${parameters.length > 0 ? "?" + parameters.map(p => `${p.label}=${p.value}`).join("&") : ""}`,
        this.config
    ).catch(formatError)).data;
}

/**
 * Permet de faire une requete (POST) sur l'api brevo
 * @param {string} path - l'action à effectuer (voir doc brevo)
 * @param {Array<{label: string, value: string}>} parameters - les parametres eventuels
 * @param {Object} data - les données à envoyer
 * @return {Promise<Object>}
 */
module.exports.post = async (path, parameters = [], data) => {
    return (await axios.post(`${link}${path}${parameters.length > 0 ? "?" + parameters.map(p => `${p.label}=${p.value}`).join("&") : ""}`,
        data, this.config
    ).catch(formatError));
}

/**
 * Permet de faire une requete (DELETE) sur l'api brevo
 * @param {string} path - l'action à effectuer (voir doc brevo)
 * @param {Array<{label: string, value: string}>} parameters - les parametres eventuels
 * @return {Promise<Object>}
 */
module.exports.delete = async (path, parameters = []) => {
    return (await axios.delete(`${link}${path}${parameters.length > 0 ? "?" + parameters.map(p => `${p.label}=${p.value}`).join("&") : ""}`,
        this.config
    ).catch(formatError));
}

/**
 * Permet de faire une requete (PATCH) sur l'api brevo
 * @param {string} path - l'action à effectuer (voir doc brevo)
 * @param {Array<{label: string, value: string}>} parameters - les parametres eventuels
 * @param {Object} data - les données à modifier
 * @return {Promise<Object>}
 */
module.exports.patch = async (path, parameters = [], data) => {
    return (await axios.patch(`${link}${path}${parameters.length > 0 ? "?" + parameters.map(p => `${p.label}=${p.value}`).join("&") : ""}`,
        data, this.config
    ).catch(formatError));
}

/**
 * Permet de recuper les info d'un contact par son id baserow
 * @param id
 * @return {Promise<Contact>}
 */
module.exports.getContact = async (id) => {
    return await this.get(`database/rows/table/${this.tables.adh_symp}/${id}/`, [this.fieldsNames]);
}

/**
 * Permet de recuper les info d'une commune par son id baserow
 * @param ID
 * @return {Promise<Commune>}
 */
module.exports.getCommuneByID = async (ID) => {
    return await this.get(`database/rows/table/${this.tables.commune}/${ID}/`, [this.fieldsNames]);
}

/**
 * Permet d'obtenir tout les evenements (passé) sans compte rendu
 * @return {Promise<Array<Evenement>>}
 */
module.exports.getEventNoCR = async () => {
    let result = await this.get(`database/rows/table/${this.tables.event}/`, [this.fieldsNames,
        {
            label: "filters",
            value: JSON.stringify({
                filter_type: "AND",
                filters: [{
                    type: "date_is_before",
                    field: "Date",
                    value: "Europe/Paris??yesterday"
                },
                    {
                        type: "empty",
                        field: "4-Participants-et-CR",
                        value: ""
                    }],
                groups: []
            })
        }]);
    if (!result || result.count === 0 || !result.results) return [];
    const events = result.results;
    while (result.next) {
        result = await this.get(result.next.replace("http://api.baserow.io/api/", ""), []);
        if (!result || result.count === 0 || !result.results) continue;
        events.push(...result.results);
    }
    return events;
}
/*Pour limiter à 1 semaine
,
                    {
                        type: "date_is_after",
                        field: "Date",
                        value: "Europe/Paris?8?nr_days_ago"
                    }
 */