const {removeMetaData, getToken} = require("../../api/discord");
const {getContactFromId, updateContact, isLinked} = require("../../api/brevo");
module.exports = {
    method: "GET",
    token: true,
    exec: async (req, res) => {
        if (!req.query.identifier) return {error: "No identifier provided."}; //TODO: page d'erreur
        const userData = await getContactFromId(req.query.identifier);
        if (userData.error) return userData //TODO: renvoyer vers une page d'erreur
        if (!(await isLinked(userData.email, userData.attributes.DISCORD_ID))) return {message: "No Discord account linked"};
        return res.redirect("/discord/unlogin-from-discord?identifier=" + req.query.identifier);
        /*const token = await getToken({email: userData.email});
        if (!token) return {message: "No Discord account linked"};
        const result = await removeMetaData(userData.attributes.DISCORD_ID, token);
        //console.log(result.data);
        if (result.data.error) return { // ne fct pas ...
            error: "Error when removing metaData",
            full: result.error,
            message: result.data.error
        }; //TODO: renvoyer vers une page d'erreur
        const resBrevo = await updateContact(userData.email, {
            attributes: {
                DISCORD_ID: "",
                DISCORD_REFRESH_TOKEN: ""
            }
        });
        if (resBrevo.error) return {error: resBrevo.error, full: resBrevo} //TODO: renvoyer vers une page d'erreur
        return {message: "Déconnexion réussie"} //TODO: renvoyer vers une page indiquant que la deconnection est reussite*/
    }
}