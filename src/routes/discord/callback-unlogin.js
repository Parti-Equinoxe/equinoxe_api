const {getContactFromDiscord, updateContact, getContactFromId, isLinked} = require("../../api/brevo");
const {getOAuthTokens, getUserData, removeMetaData} = require("../../api/discord");
module.exports = {
    method: "GET",
    exec: async (req, res) => {
        //TODO: tester si sa marche
        const {state, identifier} = req.signedCookies;
        if (state !== req.query.state) return {error: "Invalid Request"}; //TODO: renvoyer vers une page d'erreur
        const userData = await getContactFromId(identifier);
        if (userData.error) return userData //TODO: renvoyer vers une page d'erreur
        let token = await getOAuthTokens(req.query.code,"https://youri.cleboost.com/discord/callback-unlogin");
        const userDiscord = await getUserData(token);
        if (!(await isLinked(userData.email, userDiscord.id))) return {message: "This discord account is not linked to this contact"}
        const result = await removeMetaData(userDiscord.id, token);
        if (result.error) return {error: "Error when removing metaData", full: result.error}; //TODO: renvoyer vers une page d'erreur
        const resBrevo = await updateContact(userData.email, {
            attributes: {
                DISCORD_ID: "",
                DISCORD_REFRESH_TOKEN: ""
            }
        });
        if (resBrevo.error) return {error: resBrevo.error, full: resBrevo} //TODO: renvoyer vers une page d'erreur
        return {message: "Déconnexion réussie"} //TODO: renvoyer vers une page indiquant que la deconnection est reussite
    }
}