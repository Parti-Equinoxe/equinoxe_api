const {post, get} = require("axios");
module.exports = {
    method: "GET",
    exec: async (req, res) => {
        const code = req.query.code;
        try {
            const tokenResponse = await post('https://discord.com/api/v10/oauth2/token', {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: process.env.REDIRECT_URI
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Bearer aa`
                },
                auth:{
                    username: process.env.CLIENT_ID,
                    password: process.env.CLIENT_SECRET
                }
            });

            const accessToken = tokenResponse.data.access_token;

            const userResponse = await get('https://discord.com/api/v10/users/@me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            const user = userResponse.data;
            const userId = user.id;
            console.log(userId);
            // Vous pouvez maintenant utiliser l'ID de l'utilisateur Discord
            //res.send(`User ID: ${userId}`);
            return {message:"Connexion réussie"}
        } catch (error) {
            console.error(error);
            return {error:"Error during authentication", full: error, message: error.response.statusText};
        }
    }
}