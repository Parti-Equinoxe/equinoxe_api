const {updateContact, getStatus} = require("../../api/brevo");
const {getOAuthTokens, getUserData, refreshToken, pushMetaData, saveToken} = require("../../api/discord");
module.exports = {
    method: "GET",
    exec: async (req, res) => {
        const {state, email} = req.signedCookies; //TODO: amener l'email ici
        if (state !== req.query.state) return {error: "Invalid Request"}; //TODO: renvoyer vers une page erreurs
        let token = await getOAuthTokens(req.query.code);
        const user = await getUserData(token);
        /*if (!(await isLink(email, user.id))) {
            //ajout l'id discord et un refresh token
            //updateContact(email, {attributes:{DISCORD_ID: user.id, DISCORD_REFRESH_TOKEN: token.refresh_token}});
        }*/
        //puis lire les pour push les metadata
        //const status = getStatus({userID: user.id});
        //const result = await pushMetaData(user.id, token, {adh: +status.adh ?? 0, symp: +status.symp ?? 0}); // le + devenat permet de convertir de boolean a 0 et 1
        const result = await pushMetaData(user.id, token, {adh: 1, symp: 0});
        token = result.token;
        //met a jour le refresh token
        //await saveToken(user.id, email, token);
        return {message: "Connexion réussie"} //TODO: renvoyer vers une page indiquant que la connection est réussite
    }
}