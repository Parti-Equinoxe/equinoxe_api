const brevo = require("../../api/brevo");
const {getContact, getEventNoCR} = require("../../api/baserow");
const {post} = require("axios");
const footers = [
    "Ce qui n'est pas dans la base de données n'existe pas !",
    "Pensez à faire le CR dans les 48h après l'événement.",
    "Seymour est jamais très loin - attention !",
    "Encore ?! - nan je rigole !",
    "Le CR est important !",
    "Ça arrive à tout le monde d'oublier un CR."
];
module.exports = {
    method: "GET",
    disable: true,
    async exec(req, res) {
        const events = await getEventNoCR();
        if (events.length === 0) return {message: "No event found"};
        let count = 0;
        const orgas = [];
        for (const event of events) {
            const dateEvent = new Date(event.Date);
            for (const orga of event["1-Organisateurs"]) {
                const fiche = await getOrCreateOrga(orga, orgas)
                fiche.events.push({
                    ID: event.id,
                    nom: event["Nom complet test"],
                    date: dateEvent
                });
            }
            count++;
        }
        if (orgas.length === 0) return {message: "No valid event found"};
        const date = new Date(Date.now());
        //faudra filter en 2 : ce qui ont discord et ce qui n'ont pas => envoyé un sms ?
        const msgs = orgas.filter(o => o.discordID).map(orga => {
            if (orga.events.length === 0) return null;
            return {
                content: tag(orga),
                embeds: [{
                    title: orga.name,
                    description: `Vous n'avez pas rendu de CR pour **${orga.events.length}** evénement${orga.events.length === 1 ? "" : "s"} :`,
                    fields: orga.events.map(e => ({
                        name: e.nom,
                        value: `Il a eu lieu <t:${Math.floor(e.date.getTime() / 1000)}:R>`,
                        inline: true
                    })),
                    footer: {
                        text: footers[Math.floor(Math.random() * footers.length)]
                    },
                    timestamp: date.toISOString(),
                    color: parseInt(orga.events.length > 1 ? "ff4400" : "ffd500", 16)
                }]
            }
        });
        await packEndSend(msgs, 5)
        return {message: `${count} event sans CR et ${msgs.length} rappels envoyé.`};

    }
}

/**
 * @param orga
 * @param orgas
 * @return {Promise<{name, ID, mail: null | string, discordID: null | string, events: Array<{ID: number, nom: string, date: Date}>}>}
 */
async function getOrCreateOrga(orga, orgas) {
    let fiche = orgas.find(o => o.ID === orga.id);
    if (!!fiche) return fiche;
    const info = await getContact(orga.id);
    fiche = {
        name: orga.value,
        ID: orga.id,
        mail: null,
        discordID: null,
        events: [],
    };
    if (info.error || !info.Courriel) {
        orgas.push(fiche);
        return fiche;
    }
    fiche.mail = info.Courriel;
    if (!!fiche.mail) {
        const brevoInfo = await brevo.getContact(fiche.mail);
        if (!brevoInfo.error && brevoInfo.attributes.DISCORD_ID) fiche.discordID = brevoInfo.attributes.DISCORD_ID;
    }
    orgas.push(fiche);
    return fiche;
}

/**
 *
 * @param orga
 * @return {string}
 */
function tag(orga) {
    if (!orga.discordID) return `**${orga.name}**`;
    return `<@${orga.discordID}>`;
}

/**
 *
 * @param msgs
 * @param {number } nb - le nombre d'embed apr message, max 10 (limite de discord)
 * @return {Promise<void>}
 */
async function packEndSend(msgs, nb) {
    let n = 0;
    while (n < msgs.length) {
        const content = [], embeds = [];
        for (const msg of msgs.slice(n, n + nb)) {
            content.push(msg.content);
            embeds.push(msg.embeds[0]);
        }
        await post(process.env.DISCORD_WEBHOOK_NOTIFICATION_GL, {
            content: content.join(", "),
            embeds: embeds
        }).catch(e => {
            console.log(`>> Erreur lors de l'envoie d'un rappel (packed) de CR :`);
            console.log(e);
        });
        n += nb;
    }
}