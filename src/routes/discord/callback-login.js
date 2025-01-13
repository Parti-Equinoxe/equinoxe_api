const {transformList, isLinked, getContactFromId} = require("../../api/brevo");
const {getOAuthTokens, getUserData, refreshToken, pushMetaData, saveToken} = require("../../api/discord");
module.exports = {
    method: "GET",
    exec: async (req, res) => {
        const {state, identifier} = req.signedCookies;
        console.log(identifier);
        if (state !== req.query.state) return {error: "Invalid Request"}; //TODO: renvoyer vers une page d'erreur
        let token = await getOAuthTokens(req.query.code, "https://youri.cleboost.com/discord/callback-login");
        const userDiscord = await getUserData(token);
        const userData = await getContactFromId(identifier);
        if (userData.error) return userData //TODO: renvoyer vers une page d'erreur
        if (userData.attributes.DISCORD_ID && userData.attributes.DISCORD_ID !== userDiscord.id) {
            //TODO: renvoyer vers une page d'erreur
            return {error: "Contact already linked to another Discord account"};
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
        return {message: "Connexion réussie"} //TODO: renvoyer vers une page indiquant que la connection est reussite
    }
}