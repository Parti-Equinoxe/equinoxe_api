/**
 * Module pour communiquer avec l'api discord
 * @module discord
 */
const axios = require("axios");
const {updateContact, getContact, getContactFromDiscord} = require("./brevo");

const platformName = "Test Adh";

/**
 * @typedef {{access_token: string, refresh_token: string, expires_at: number}} Token
 */

/**
 * Permet de formater le token a partir de la reponse discord
 * @return {Token}
 */
function formatToken(data) {
    return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: Date.now() + data.expires_in * 1000
    }
}

/**
 * Permet de recupere le token OAuth
 * @param {string} code
 * @param redirectUrl
 * @return {Promise<Token>}
 */
module.exports.getOAuthTokens = async (code, redirectUrl) => {
    const tokenResponse = await axios.post("https://discord.com/api/v10/oauth2/token", {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUrl,
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
            username: process.env.DISCORD_CLIENT_ID,
            password: process.env.DISCORD_CLIENT_SECRET
        }
    });
    return formatToken(tokenResponse.data);
}


/**
 * Permet de refresh le token (si besoin)
 * @param {string} userId
 * @param {} token
 * @return {Promise<Token>}
 */
module.exports.refreshToken = async (userId, token) => {
    if (Date.now() > token.expires_at) {
        const tokenResponse = await axios.post("https://discord.com/api/v10/oauth2/token", {
            grant_type: 'refresh_token',
            refresh_token: token.refresh_token,
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            auth: {
                username: process.env.DISCORD_CLIENT_ID,
                password: process.env.DISCORD_CLIENT_SECRET
            }
        });
        console.log(tokenResponse.data);
        return formatToken(tokenResponse.data);
    }
    console.log("Pas besoin de maj");
    return token;
}

/**
 * Permet de recuperer les informations d'un compte discord
 * Attention ne refresh pas le token
 * @param {Token} token
 * @return {Promise<Object | null>} - null = token plus valide
 */
module.exports.getUserData = async (token) => {
    if (Date.now() > token.expires_at) return null;
    const url = "https://discord.com/api/v10/users/@me";
    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${token.access_token}`,
        }
    });
    return response.data;
}

const urlMetaData = `https://discord.com/api/v10/users/@me/applications/${process.env.DISCORD_CLIENT_ID}/role-connection`;
/**
 * Permet de sauvegarder les MetaData
 * @param {string} userID
 * @param {Token} token
 * @param {{adh: 0 | 1, symp: 0 | 1}} metadata
 * @return {Promise<{data: Object, token: Token}>}
 */
module.exports.pushMetaData = async (userID, token, metadata) => {
    token = await this.refreshToken(userID, token);
    const respond = await axios.put(urlMetaData, {
        platform_name: platformName,
        metadata
    }, {
        headers: {
            Authorization: `Bearer ${token.access_token}`,
            "Content-Type": "application/json"
        }
    });
    return {data: respond.data, token: token};
}
/**
 * Permet de recuperer les MetaData
 * @param {string} userID
 * @param {Token} token
 * @return {Promise<{data: {
 *     platform_name: string,
 *     platform_username: string,
 *     metadata: { symp: '0' | '1', adh: '0' | '1' }
 *   }, token: Token}>}
 */
module.exports.getMetaData = async (userID, token) => {
    //TODO: verif si sa marche
    token = await this.refreshToken(userID, token);
    const respond = await axios.get(urlMetaData, {
        headers: {
            Authorization: `Bearer ${token.access_token}`,
        }
    });
    return {data: respond.data, token: token};
}

/**
 * Permet de supprimer les MetaData
 * @param {string} userID
 * @param {Token} token
 * @return {Promise<Object>}
 */
module.exports.removeMetaData = async (userID, token) => {
    //token = await this.refreshToken(userID, token);
    /*return await axios.delete(urlMetaData, {
        headers: {
            Authorization: `Bearer ${token.access_token}`,
        }
    });*/
    return await this.pushMetaData(userID, token, {adh: 0, symp: 0});
}

/**
 * Permet de sauvegarder le refresh token sur brevo
 * @param {string} userID - le userID sera mit a jour au passage
 * @param {string} email
 * @param {Token} token
 * @return {Promise<Object>}
 */
module.exports.saveToken = async (userID, email, token) => {
    token = await this.refreshToken(userID, token);
    const resp = await updateContact(email, {
        attributes: {
            DISCORD_ID: userID,
            DISCORD_REFRESH_TOKEN: token.refresh_token
        }
    });
    return resp.data;
}

/**
 * Permet de récupérer le refresh token depuis brevo
 * @param {{userID: string} | {email: string}} identifier
 * @return {Promise<null | Token>}
 */
module.exports.getToken = async (identifier) => {
    let resp;
    if (identifier.hasOwnProperty("email")) {
        resp = await getContact(identifier.email);
    }
    if (identifier.hasOwnProperty("userID")) {
        resp = await getContactFromDiscord(identifier.userID);
    }
    console.log(identifier);
    console.log(resp);
    if (!resp || !resp.attributes || !resp.attributes.DISCORD_ID || !resp.attributes.DISCORD_REFRESH_TOKEN) return null;
    return await this.refreshToken(resp.attributes.DISCORD_ID, {
        expires_at: 0,
        refresh_token: resp.attributes.DISCORD_REFRESH_TOKEN
    });
}

/**
 * L'URL du webhook de test (envoi dans #test-bot)
 * @type {string}
 */
module.exports.webhookTestURL = "https://discord.com/api/webhooks/1365998103714467951/VR4-YoSY0XYoFK-sfHKNYNhy9nr0oYHfRKEiGYuH3_ado2zkxspj5e6QCAypX3ZYL4VX";