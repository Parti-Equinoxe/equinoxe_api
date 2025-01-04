module.exports = {
    method: "GET",
    token: true,
    exec: (req, res) => {
        const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=code&scope=identify`;
        res.redirect(authUrl);
        return {message: "Redirection vers Discord"}
    }
}