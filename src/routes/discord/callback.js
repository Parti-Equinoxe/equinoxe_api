const {updateContact} = require("../../api/brevo");
const {getOAuthTokens, getUserData, refreshToken} = require("../../api/discord");
module.exports = {
    method: "GET",
    exec: async (req, res) => {
        const {state} = req.signedCookies;
        if (state !== req.query.state) return {error: "Invalid Request"}; //TODO: renvoyer vers une page erreurs
        const token = await getOAuthTokens(req.query.code);
        const user = await getUserData(token)
        await refreshToken(user.id, token);
        //updateContact(email, {attributes:{DISCORD_ID: user.id,DISCORD_REFRESH_TOKEN: token.refresh_token}});
        return {message: "Connexion réussie"} //TODO: renvoyer vers une page indiaquant que la connection est réussite
    }
}