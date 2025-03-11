const {getContactFromDiscord, updateContact, getContactFromId, isLinked} = require("../../api/brevo");
const {getOAuthTokens, getUserData, removeMetaData} = require("../../api/discord");
module.exports = {
    method: "GET",
    exec: async (req, res) => {
        const {state, identifier} = req.signedCookies;
        if (state !== req.query.state) return {
            error: "Invalid Request",
            redirect: "https://membres.parti-equinoxe.fr/erreur-est-survenue/"
        };
        const userData = await getContactFromId(identifier);
        if (userData.error) return {...userData, redirect: "https://membres.parti-equinoxe.fr/erreur-est-survenue/"};
        let token = await getOAuthTokens(req.query.code, `${process.env.REDIRECT_URL}/discord/callback-unlogin`);
        const userDiscord = await getUserData(token);
        if (!(await isLinked(userData.email, userDiscord.id))) return {
            message: "This discord account is not linked to this contact",
            redirect: "https://membres.parti-equinoxe.fr/ce-compte-discord-nest-pas-lie-a-ce-contact/"
        };
        const result = await removeMetaData(userDiscord.id, token);
        if (result.error) return {
            error: "Error when removing metaData",
            full: result.error,
            redirect: "https://membres.parti-equinoxe.fr/erreur-est-survenue/"
        };
        const resBrevo = await updateContact(userData.email, {
            attributes: {
                DISCORD_ID: "",
                DISCORD_REFRESH_TOKEN: ""
            }
        });
        if (resBrevo.error) return {
            error: resBrevo.error,
            full: resBrevo,
            redirect: "https://membres.parti-equinoxe.fr/erreur-est-survenue/"
        }
        return {message: "Déconnexion réussie", redirect: "https://membres.parti-equinoxe.fr/deconnexion-reussie/"};
    }
}