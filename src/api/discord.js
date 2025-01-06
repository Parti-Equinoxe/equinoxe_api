const {post, get, put} = require("axios");
const {updateContact, getContact, getContactFromDiscord} = require("./brevo");

const platformName = "Test Adh";

/**
 * Permet de formater le token a partir de la reponse discord
 * @return {{access_token: string, refresh_token: string, expires_at: number}}
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
 * @return {Promise<{access_token: string, refresh_token: string, expires_at: number}>}
 */
module.exports.getOAuthTokens = async (code) => {
    const tokenResponse = await post("https://discord.com/api/v10/oauth2/token", {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.REDIRECT_URI
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
 * @param {{access_token: string, refresh_token: string, expires_at: number}} token
 * @return {Promise<{access_token: string, refresh_token: string, expires_at: number}>}
 */
module.exports.refreshToken = async (userId, token) => {
    if (Date.now() > token.expires_at) {
        const tokenResponse = await post("https://discord.com/api/v10/oauth2/token", {
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
        return formatToken(tokenResponse.data);
    }
    return token;
}

/**
 * Permet de recuperer les informations d'un compte discord
 * Attention ne refresh pas le token
 * @param {{access_token: string, refresh_token: string, expires_at: number}} token
 * @return {Promise<Object | null>} - null = token plus valide
 */
module.exports.getUserData = async (token) => {
    if (Date.now() > token.expires_at) return null;
    const url = "https://discord.com/api/v10/users/@me";
    const response = await get(url, {
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
 * @param {{access_token: string, refresh_token: string, expires_at: number}} token
 * @param {Object} metadata
 * @return {Promise<{data: Object, token: {access_token: string, refresh_token: string, expires_at: number}}>}
 */
module.exports.pushMetaData = async (userID, token, metadata) => {
    token = await this.refreshToken(userID, token);
    const respond = await put(urlMetaData, {
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
 * @param {{access_token: string, refresh_token: string, expires_at: number}} token
 * @return {Promise<{data: Object, token: {access_token: string, refresh_token: string, expires_at: number}}>}
 */
module.exports.getMetaData = async (userID, token) => {
    token = await this.refreshToken(userID, token);
    const respond = await get(urlMetaData, {
        headers: {
            Authorization: `Bearer ${token.access_token}`,
        }
    });
    return {data: respond.data, token: token};
}

/**
 * Permet de sauvegarder le refresh token sur brevo
 * @param {string} userID - le userID sera mit a jour au passage
 * @param {string} email
 * @param {{access_token: string, refresh_token: string, expires_at: number}} token
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
 * @return {Promise<null | {access_token: string, refresh_token: string, expires_at: number}>}
 */
module.exports.getToken = async (identifier) => {
    let resp;
    if (identifier.hasOwnProperty("email")) {
        resp = await getContact(identifier.email);
        if (!(resp.attributes.DISCORD_ID)) return null;
    }
    if (identifier.hasOwnProperty("userID")) {
        resp = await getContactFromDiscord(identifier.userID);
        if (!resp) return null
    }
    return await this.refreshToken(resp.attributes.DISCORD_ID, {
        expires_at: 0,
        refresh_token: resp.attributes.DISCORD_REFRESH_TOKEN
    });
}