module.exports = {
    method: "GET",
    token: true,
    exec: (req, res) => {
        const state = crypto.randomUUID(); // permet d'augementer la sécurité
        const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=code&scope=identify+role_connections.write&state=${state}`;
        res.cookie("state", state, {maxAge: 1000 * 60 * 5, signed: true});
        //res.cookie("email", req.query.email, {maxAge: 1000 * 60 * 5, signed: true}); //TODO: a voir comment amener l'email ici, de facon securise
        //utiliser le userID de brevo ? (mieux que email)
        res.redirect(authUrl);
        return {message: "Redirection vers Discord"}
    }
}