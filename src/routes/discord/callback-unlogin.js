const {getContactFromDiscord} = require("../../api/brevo");
const {getOAuthTokens, getUserData, removeMetaData} = require("../../api/discord");
module.exports = {
    method: "GET",
    exec: async (req, res) => {
        //TODO: tester si sa marche
        const {state} = req.signedCookies;
        if (state !== req.query.state) return {error: "Invalid Request"}; //TODO: renvoyer vers une page d'erreur
        let token = await getOAuthTokens(req.query.code);
        const userDiscord = await getUserData(token);
        const userData = await getContactFromDiscord(userDiscord.id);
        if (userData.error) return userData //TODO: renvoyer vers une page d'erreur
        const result = await removeMetaData(userDiscord.id, token);
        if (result.error) return {error: "Error when removing metaData", full: result.error}; //TODO: renvoyer vers une page d'erreur
        return {message: "Déconnexion réussie"} //TODO: renvoyer vers une page indiquant que la deconnection est reussite
    }
}