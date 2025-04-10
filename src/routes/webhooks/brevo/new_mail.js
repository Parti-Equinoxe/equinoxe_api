const axios = require("axios");
module.exports = {
    method: "POST",
    /**
     * @param {Request} req
     * @param {Response} res
     * @return {{message: string}}
     */
    async exec(req, res) {
        const data = req.body;
        if (!data || !data.items) return {error: "Bad event."};
        console.dir(data, {depth: null});
        let count = 0;
        for (const mail of data.items) {
            if (!mail["Corps du texte"]) continue;
            const date= new Date(Date.now())
            const dateEnvoi = new Date(mail["Date d'envoi"]);
            const embed = {
                title: `${mail["Objet"] ?? "Nouveau Mail :"} - ${dateEnvoi.getDate()}/${dateEnvoi.getMonth()+1}/${dateEnvoi.getFullYear()}`.slice(0,99),
                description: mail["Corps du texte"].slice(0, 4000),
                timestamp: date.toISOString(),
                color: parseInt("19171C", 16),
                footer:{text: mail["Mail envoi"].toString() ?? null}
            };
            await axios.post(process.env.DISCORD_WEBHOOK_RELECTURE, {
                embeds: [embed]
            }, {headers: {"Content-Type": "application/json"}});
            count++;
        }
        return {message: `${count} webhook envoyé vers discord`};
    }
}