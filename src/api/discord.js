const {post, get} = require("axios");

const platformName = "NAME";

function formatToken(data) {
    return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: Date.now() + data.expires_in * 1000
    }
}

/**
 * @param {String} code
 * @return {Promise<{access_token: String, refresh_token: String, expires_at: Number}>}
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
 * @param {String} userId
 * @param {{access_token: String, refresh_token: String, expires_at: Number}} token
 * @return {Promise<{access_token: String, refresh_token: String, expires_at: Number}>}
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
        console.log(tokenResponse.data);
        return formatToken(tokenResponse.data);
    }
    return token;
}

/**
 * @param {{access_token: String, refresh_token: String, expires_at: Number}} token
 * @return {Promise<Object>}
 */
module.exports.getUserData = async (token) => {
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
 * @param {String} userID
 * @param {{access_token: String, refresh_token: String, expires_at: Number}} token
 * @param {Object} metadata
 * @return {Promise<any>}
 */
module.exports.pushMetaData = async (userID, token, metadata) => {
    token = await this.refreshToken(userID, token);
    const respond = await post(urlMetaData, {
        platform_name: platformName,
        metadata
    }, {
        headers: {
            Authorization: `Bearer ${token.access_token}`,
            "Content-Type": "application/json"
        }
    });
    return respond.data;
}
/**
 * @param {String} userID
 * @param {{access_token: String, refresh_token: String, expires_at: Number}} token
 * @return {Promise<any>}
 */
module.exports.getMetaData = async (userID, token) => {
    token = await this.refreshToken(userID, token);
    const respond = await get(urlMetaData, {
        headers: {
            Authorization: `Bearer ${token.access_token}`,
        }
    });
    return respond.data;
}