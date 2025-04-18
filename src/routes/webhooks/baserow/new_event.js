const axios = require("axios");
const champs ={
    description: "Description de l'événement",
    title: "Nom complet test",
    footer: "Ville",
    date: "Date"
};

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
        if (!data || !data.items) return {error: "Bad event data."};
        if (data.event_type !== "rows.created") return {error: "Bad event type."};
        let count = 0;
        for (const mail of data.items) {
            if (!mail[champs.title]) continue;
            const date= new Date(Date.now())
            const dateEnvoi = new Date(mail[champs.date]);
            console.log(dateEnvoi);
            const embed = {
                title: `${mail[champs.title] ?? "Nouveau Évenement :"} - ${dateEnvoi.getDate()}/${dateEnvoi.getMonth()+1}/${dateEnvoi.getFullYear()}`.slice(0,99),
                description: mail["Corps du texte"].slice(0, 4000),
                timestamp: date.toISOString(),
                color: parseInt("19171C", 16),
                footer:{text:( mail[champs.footer] ?? "").toString() ?? null}
            };
            await axios.post(process.env.DISCORD_WEBHOOK_SITE_INTERNET, {
                embeds: [embed]
            }, {headers: {"Content-Type": "application/json"}});
            count++;
        }
        if (count===0) return {message: "Accepted"}
        return {message: `${count} webhook envoyé vers discord`};
    }
}