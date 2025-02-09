const {getContactFromId} = require("../../api/brevo");
const redirectURL = `${process.env.REDIRECT_URL}/discord/callback-login`;
//TODO: code pour exporter les adh actuels
module.exports = {
    method: "GET",
    exec: async (req, res) => {
        if (!req.query.identifier) return {
            error: "No identifier provided.",
            redirect: "https://membres.parti-equinoxe.fr/erreur-est-survenue/"
        };
        const identifier = req.query.identifier;
        const userData = await getContactFromId(identifier);
        if (userData.attributes.DISCORD_ID) return {
            message: "This contact is already linked to a Discord account",
            redirect: "https://membres.parti-equinoxe.fr/compte-discord-deja-lie/"
        };
        const state = crypto.randomUUID(); // permet d'augementer la sécurité
        const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectURL)}&response_type=code&scope=identify+role_connections.write&state=${state}`;
        res.cookie("state", state, {maxAge: 1000 * 60 * 5, signed: true});
        //id brevo
        res.cookie("identifier", identifier, {maxAge: 1000 * 60 * 5, signed: true}); //TODO: est t il possible faire de plus securise ?
        return res.redirect(authUrl);
    }
}