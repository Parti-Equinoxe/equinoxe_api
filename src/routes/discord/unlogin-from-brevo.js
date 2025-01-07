const {removeMetaData, getToken} = require("../../api/discord");
const {getContactFromId} = require("../../api/brevo");
module.exports = {
    method: "GET",
    token: true,
    exec: async (req, res) => {
        if (!req.query.identifier) return {error: "No identifier provided."}; //TODO: page d'erreur
        const userData = await getContactFromId(req.query.identifier);
        if (userData.error) return userData //TODO: renvoyer vers une page d'erreur
        const token = getToken({email:userData.email});
        if (!token) return {error: "No Discord account linked"};
        const result = await removeMetaData(userData.attributes.DISCORD_ID, token);
        if (result.error) return {error: "Error when removing metaData", full: result.error}; //TODO: renvoyer vers une page d'erreur
        return {message: "Déconnexion réussie"} //TODO: renvoyer vers une page indiquant que la deconnection est reussite
    }
}