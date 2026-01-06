const axios = require("axios");
const champs = {
    title: "Nom complet",
    description: "Description de l'événement",
    public: "Evénement public ?",
    roleID: "1307313573755879454" // equipe site internet
};
const option_public = ["Oui", "Tout public"]

module.exports = {
    method: "POST",
    /**
     * @param {Request} req
     * @param {Response} res
     * @return {{message: string}}
     */
    async exec(req, res) {
        const data = req.body;
        {
            const date = new Date();
            console.log(`Nouveau event reçu - ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} - ${date.getHours()}h${date.getMinutes()}`);
        }
        console.dir(data, {depth: null});
        if (!data || !data.items) return {error: "Bad event data."};
        if (data.event_type !== "rows.created") return {error: "Bad event type."};
        let count = 0;
        for (const event of data.items) {
            if (!event[champs.title]) continue;
            if (!event[champs.public] || !option_public.includes(event[champs.public].value)) continue;
            const date = new Date(Date.now())
            const embed = {
                title: event[champs.title].slice(0, 99),
                description: (event[champs.description] ?? "Pas de descrption").slice(0, 4000),
                timestamp: date.toISOString(),
                color: parseInt("19171C", 16),
            };
            await axios.post(process.env.DISCORD_WEBHOOK_SITE_INTERNET, {
                content: `Ya un nouvel événement <@&${champs.roleID}> !!`,
                embeds: [embed]
            }, {headers: {"Content-Type": "application/json"}});
            count++;
        }
        if (count === 0) return {message: "Accepted"}
        return {message: `${count} webhook envoyé vers discord`};
    }
}