const axios = require("axios");
const champs = {
    title: "Nom complet test",
    description: "Description de l'événement",
    roleID: "1307313573755879454" // equipe site internet
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
        for (const event of data.items) {
            if (!event[champs.title]) continue;
            const publique = !!event["Evénement public ?"] && event["Evénement public ?"].value !== "Oui";
            const date = new Date(Date.now())
            const embed = {
                title: event[champs.title].slice(0, 99),
                description: (event[champs.description] ?? "Pas de descrption").slice(0, 4000),
                timestamp: date.toISOString(),
                color: parseInt("19171C", 16),
            };
            await axios.post(process.env.DISCORD_WEBHOOK_SITE_INTERNET, {
                content: publique ? `Ya un nouvel évenement <@&${champs.roleID}> !!` : null,
                embeds: [embed]
            }, {headers: {"Content-Type": "application/json"}});
            count++;
        }
        if (count === 0) return {message: "Accepted"}
        return {message: `${count} webhook envoyé vers discord`};
    }
}