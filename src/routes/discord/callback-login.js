const {transformList, getContactFromId} = require("../../api/brevo");
const {getOAuthTokens, getUserData, pushMetaData, saveToken} = require("../../api/discord");
module.exports = {
    method: "GET",
    exec: async (req, res) => {
        const {state, identifier} = req.signedCookies;
        if (state !== req.query.state) return {
            error: "Invalid Request",
            redirect: "https://membres.parti-equinoxe.fr/erreur-est-survenue/"
        };
        let token = await getOAuthTokens(req.query.code, `${process.env.REDIRECT_URL}/discord/callback-login`);
        const userDiscord = await getUserData(token);
        //if ((await getContactFromDiscord(userDiscord.id))) return {message: "This Discord account is already linked to a contact"};
        const userData = await getContactFromId(identifier);
        if (userData.error) return {...userData, redirect: "https://membres.parti-equinoxe.fr/erreur-est-survenue/"};
        if (userData.attributes.DISCORD_ID && userData.attributes.DISCORD_ID !== userDiscord.id) {
            return {
                message: "Contact already linked to another Discord account",
                redirect: "https://membres.parti-equinoxe.fr/compte-discord-deja-lie/"
            };
        }
        /*if (!(await isLinked(userData.email, userDiscord.id))) {
            //ajout l'id discord et un refresh token
            const r = await saveToken(userDiscord.id, userData.email, token);
            console.log(r);
        }
        //puis lire les pour push les metadata
        //on met a jour le token pour etre sur qu'il a pas ete utiliser ailleur entre temps
        token = await refreshToken(userDiscord.id, {expires_at: 0, refresh_token: userData.attributes.DISCORD_REFRESH_TOKEN});
         */
        const list = transformList(userData.listIds);
        const result = await pushMetaData(userDiscord.id, token, {
            adh: +(list.adherents ?? 0),
            symp: +(list.sympathisants ?? 0)
        }); // le + devant permet de convertir les boolean en 0 et 1
        token = result.token;
        //met a jour le refresh token
        await saveToken(userDiscord.id, userData.email, token);
        //Redirgie vers discord
        return {message: "Redirection vers Discord", redirect: `https://discord.gg/${process.env.DISCORD_INVITE_CODE}`};
    }
}