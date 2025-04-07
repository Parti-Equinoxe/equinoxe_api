const axios = require("axios");
const urlWebhookMail = "https://discord.com/api/webhooks/1334093029232873473/OnyH_BQ9eM4RTM5lR0KMmcNWr11PKSkFg9gOjsbBkrZwXcjgOpec0GG3LX0hVqcr_TE8";
module.exports = {
    method: "POST",
    /**
     * @param {Request} req
     * @param {Response} res
     * @return {{message: string}}
     */
    async exec(req, res) {
        const data = req.body;
        console.dir(data, {depth: null});
        let count = 0;
        for (const mail of data.items) {
            if (!mail["Corps du texte"]) continue;
            console.log(mail["Date d'envoi"]);
            const date= new Date(Date.now())
            const embed = {
                title: mail["Objet"] ?? "Nouveau Mail :",
                description: mail["Corps du texte"].slice(0, 4000),
                timestamp: date.toISOString(),
                color: parseInt("19171C", 16),
                footer:{text: mail["Département"] ?? null}
            };
            await axios.post(urlWebhookMail, {
                embeds: [embed]
            }, {headers: {"Content-Type": "application/json"}});
            count++;
        }
        return {message: `${count} webhook envoyé vers discord`};
    }
}