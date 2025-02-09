const redirectURL = `${process.env.REDIRECT_URL}/discord/callback-unlogin`;

module.exports = {
    method: "GET",
    token: true,
    exec: (req, res) => {
        if (!req.query.identifier) return {error: "No identifier provided."}; //TODO: page d'erreur
        const state = crypto.randomUUID(); // permet d'augementer la sécurité
        const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectURL)}&response_type=code&scope=identify+role_connections.write&state=${state}`;
        res.cookie("state", state, {maxAge: 1000 * 60 * 5, signed: true});
        //id brevo
        res.cookie("identifier", req.query.identifier, {maxAge: 1000 * 60 * 5, signed: true}); //TODO: est t il possible faire de plus securise ?
        res.redirect(authUrl);
        return {message: "Redirection vers Discord"}
    }
}