const {redBright, greenBright} = require("cli-color");
const {put} = require("axios");
module.exports = {
    token: true,
    exec: async (req, res) => {
        // supported types: number_lt=1, number_gt=2, number_eq=3 number_neq=4, datetime_lt=5, datetime_gt=6, boolean_eq=7, boolean_neq=8
        //https://discord.com/developers/docs/resources/application-role-connection-metadata
        const resp = await put(`https://discord.com/api/v10/applications/${process.env.DISCORD_CLIENT_ID}/role-connections/metadata`,
            [{
                key: "adh",
                name: "Adhérent(e)",
                description: "Si vous êtes ou non adhérent(e) Équinoxe",
                type: 7
            }, {
                key: "symp",
                name: "Sympathisant(e)",
                description: "Si vous êtes ou non sympathisant(e) Équinoxe",
                type: 7
            }],
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
                },
            }
        );
        if (resp.status === 200) {
            console.log(greenBright("Enregistrement réussi !!"));
            return {message: "Enregistrement réussi !!"};
        }
        console.log(redBright("Erreur lors de l'enregistrement !!"));
        return {error: "Erreur lors de l'enregistrement !!", message: resp.statusText};
    }
}